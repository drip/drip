var sys         = require('sys'),
    spawn       = require('child_process').spawn,
    Repository  = require('./models/repository').Repository,
    Build       = require('./models/build').Build,
    resque      = require('./config/resque'),
    mongoose    = require('./config/mongoose'),
    redis       = require('./config/redis'),
    ObjectId    = require('mongoose').Types.ObjectId; 

var Jobs = {
  succeed:  function (arg, callback) { callback(); },
  fail:     function (arg, callback) { callback(new Error('fail')); },
  build:    function (build, callback) { 
    var buildId         = build.buildId,
        repositoryId    = build.repositoryId,
        build,
        buildRepository,
        cmds            = {},
        outputBuffer    = [],
        stepsSuccessful = false,
        workingDir;

    console.log('Build called; repositoryId: ' + repositoryId + ' buildId: ' + buildId);

    Repository.findOne({ '_id': new ObjectId(repositoryId) }, function (err, repository) { 
      if (err) throw err;
      
      console.log('Repository found, id:['+repository._id+'] url:['+repository.url+'], num builds:['+repository.builds.length+']');
      
      buildRepository = repository;

      // Get the build.
      build = repository.builds.id(buildId);

      // Start the build.
      var buildStart = function() { 
        build.startedAt = Date.now();
        build.running   = true
        repository.save(function (err) { if (err) throw err; spawnCloneDir(); });
      };

      // Make clone repo dir.
      var spawnCloneDir = function() {
        var name = 'mkdir';
        workingDir = ['/tmp/', 'dripio', repository.ownerName, repository.name, Date.now()].join('_');
        console.log("making directory ["+workingDir+"]...");
        cmds[name] = spawn('mkdir',['-vp',workingDir]);
        cmdOut.bind(name, spawnClone);
      };

      // Clone.
      //
      // setsid: true is giving me "Operation not permitted"
      // do we actually need it though? unclear about clobbering previous sessions...
      var spawnClone = function(){
        var name = 'clone';
        console.log("cloning ["+repository.url+"]...");
        cmds[name] = spawn('git', ['clone',repository.url, workingDir], {cwd: workingDir, setsid: false});
        cmdOut.bind(name, spawnCheckout);
      };
      
      // Checkout..
      var spawnCheckout = function(){
        var name = 'checkout';
        console.log("checkout ["+build.branch+"]...");
        cmds[name] = spawn('git', ['checkout',build.branch], {cwd: workingDir, setsid: false});
        cmdOut.bind(name, spawnNpmInstall);
      };

      // Setup the environment.
      var spawnNpmInstall = function(){
        var name = 'npm_install';
        console.log("running npm install...");
        cmds[name] = spawn('npm',['install'], {cwd: workingDir});
        cmdOut.bind(name, spawnNpmTest);
      };

      // NPM test.
      var spawnNpmTest = function(){
        var name = 'npm_test';
        console.log("running npm test...");
        cmds[name] = spawn('npm',['test'], {cwd: workingDir});
        cmdOut.bind(name, buildFinish);
      };

      // Finish the build and cleanup.
      var buildFinish = function() { 
        var name = 'finish';
        build.finishedAt = Date.now();
        console.log("finishing build and cleaning-up ["+build.finishedAt+"]...");
        build.completed  = true;
        build.running    = false;
        build.successful = stepsSuccessful;
        repository.save(function (err) { if (err) throw err; });
        
        cmds[name] = spawn('rm',['-vrf', workingDir]);
        cmdOut.bind(name);
      };

      // Handle the output.
      var cmdOut = {
        bind: function(name,next) {
          var spawn = cmds[name];
          this.stdout(spawn,name);
          this.stderr(spawn,name);
          this.exit(spawn,name,next);
        },
        stdout: function(spawn,name) {
          spawn.stdout.on('data', function (data) {
            console.log('stdout '+name+' ['+workingDir+']: ' + data);
            redis.rpush("builds:" + build.id, data, function() { console.log("Issued write to redis");});
            outputBuffer.push(data);
          });
        },
        stderr: function(spawn,name) {
          spawn.stderr.on('data', function (data) {
            console.log('stderr '+name+' ['+workingDir+']: ' + data);
            redis.rpush("builds:" + build.id, data, function() { console.log("Issued write to redis");});
            outputBuffer.push(data);
          });
        },
        exit: function(spawn,name,next) {
          spawn.on('exit', function (code) {
            console.log('exit '+name+' ['+workingDir+'] code: ' + code);
           
            buildRepository.save(function (err) { if (err) throw err; });
            
            if(code === 0) {
              console.log('clean exit; calling next() if present')
              stepsSuccessful = true;
              
              if (typeof(next) === 'function') {
                next();
              }
            } else {
              console.log('unclean exit; not progressing to next, typeof: '+typeof(next))
              stepsSuccessful = false;
              build.finishedAt = Date.now();

              console.log("finishing build at ["+build.finishedAt+"]...");
              build.completed  = true;
              build.running    = false;
              build.successful = stepsSuccessful;
              repository.save(function (err) { if (err) throw err; });
            }
          });
        }
      };

      // Begin.
      buildStart();
    });
    
    console.log('Build finished.');

    callback(build);
  }
};

var worker        = resque.worker('builder', Jobs),
    workerCleanup = require('./lib/worker.js').workerCleanup;

worker.on('job', function(worker, queue, job) {
  console.log("Attempting job; worker: " + worker + " queue: " + queue + " job: " + job);
});

worker.start();
