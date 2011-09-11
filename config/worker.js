(function() {
  var Build, Jobs, ObjectId, Redis, Repository, Resque, Spawn, mongoose, sys, worker, workerCleanup;
  sys = require('sys');
  Spawn = require('child_process').spawn;
  Repository = require('../models/repository').Repository;
  Build = require('../models/build').Build;
  Resque = require('../config/resque').Connection;
  mongoose = require('../config/mongoose');
  Redis = require('../config/redis').Connection;
  ObjectId = require('mongoose').Types.ObjectId;
  Jobs = {
    succeed: function(arg, callback) {
      return callback();
    },
    fail: function(arg, callback) {
      return callback(new Error('fail'));
    },
    build: function(build, callback) {
      var buildId, cmds, outputBuffer, repositoryId, stepsSuccessful, workingDir;
      buildId = build.buildId;
      repositoryId = build.repositoryId;
      cmds = {};
      outputBuffer = [];
      stepsSuccessful = false;
      workingDir = "";
      console.log('Build called; repositoryId: ' + repositoryId + ' buildId: ' + buildId);
      return Repository.findOne({
        '_id': new ObjectId(repositoryId)
      }, function(err, repository) {
        var buildFinish, buildRepository, buildStart, cmdOut, spawnCheckout, spawnClone, spawnCloneDir, spawnNpmInstall, spawnNpmTest;
        if (err) {
          throw err;
        }
        console.log('Repository found, id:[' + repository._id + '] url:[' + repository.url + '], num builds:[' + repository.builds.length + ']');
        buildRepository = repository;
        build = repository.builds.id(buildId);
        buildStart = function() {
          build.startedAt = Date.now();
          build.running = true;
          return repository.save(function(err) {
            if (err) {
              throw err;
            }
            return spawnCloneDir();
          });
        };
        spawnCloneDir = function() {
          var name;
          name = 'mkdir';
          workingDir = ['/tmp/', 'dripio', repository.ownerName, repository.name, Date.now()].join('_');
          console.log("making directory [" + workingDir + "]...");
          cmds[name] = Spawn('mkdir', ['-vp', workingDir]);
          return cmdOut.bind(name, spawnClone);
        };
        spawnClone = function() {
          var name;
          name = 'clone';
          console.log("cloning [" + repository.url + "]...");
          cmds[name] = Spawn('git', ['clone', repository.url, workingDir], {
            cwd: workingDir,
            setsid: false
          });
          return cmdOut.bind(name, spawnCheckout);
        };
        spawnCheckout = function() {
          var name;
          name = 'checkout';
          console.log("checkout [" + build.branch + "]...");
          cmds[name] = Spawn('git', ['checkout', build.branch], {
            cwd: workingDir,
            setsid: false
          });
          return cmdOut.bind(name, spawnNpmInstall);
        };
        spawnNpmInstall = function() {
          var name;
          name = 'npm_install';
          console.log("running npm install...");
          cmds[name] = Spawn('npm', ['install'], {
            cwd: workingDir
          });
          return cmdOut.bind(name, spawnNpmTest);
        };
        spawnNpmTest = function() {
          var name;
          name = 'npm_test';
          console.log("running npm test...");
          cmds[name] = Spawn('npm', ['test'], {
            cwd: workingDir
          });
          return cmdOut.bind(name, buildFinish);
        };
        buildFinish = function() {
          var name;
          name = 'finish';
          build.finishedAt = Date.now();
          console.log("finishing build and cleaning-up [" + build.finishedAt + "]...");
          build.completed = true;
          build.running = false;
          build.successful = stepsSuccessful;
          repository.save(function(err) {
            if (err) {
              throw err;
            }
          });
          cmds[name] = Spawn('rm', ['-vrf', workingDir]);
          return cmdOut.bind(name);
        };
        cmdOut = {
          bind: function(name, next) {
            var spawn;
            spawn = cmds[name];
            this.stdout(spawn, name);
            this.stderr(spawn, name);
            return this.exit(spawn, name, next);
          },
          stdout: function(spawn, name) {
            return spawn.stdout.on('data', function(data) {
              console.log('stdout ' + name + ' [' + workingDir + ']: ' + data);
              Redis.rpush("builds:" + build.id, data, function() {
                return console.log("Issued write to redis");
              });
              return outputBuffer.push(data);
            });
          },
          stderr: function(spawn, name) {
            return spawn.stderr.on('data', function(data) {
              console.log('stderr ' + name + ' [' + workingDir + ']: ' + data);
              Redis.rpush("builds:" + build.id, data, function() {
                return console.log("Issued write to redis");
              });
              return outputBuffer.push(data);
            });
          },
          exit: function(spawn, name, next) {
            return spawn.on('exit', function(code) {
              console.log('exit ' + name + ' [' + workingDir + '] code: ' + code);
              buildRepository.save(function(err) {
                if (err) {
                  throw err;
                }
              });
              if (code === 0) {
                console.log('clean exit; calling next() if present');
                stepsSuccessful = true;
                if (typeof next === 'function') {
                  return next();
                }
              } else {
                console.log('unclean exit; not progressing to next, typeof: ' + typeof next);
                stepsSuccessful = false;
                build.finishedAt = Date.now();
                console.log("finishing build at [" + build.finishedAt + "]...");
                build.completed = true;
                build.running = false;
                build.successful = stepsSuccessful;
                return repository.save(function(err) {
                  if (err) {
                    throw err;
                  }
                });
              }
            });
          }
        };
        buildStart();
        console.log('Build finished.');
        return callback(build);
      });
    }
  };
  worker = Resque.worker('builder', Jobs);
  workerCleanup = require('../lib/worker').workerCleanup;
  worker.on('poll', function(worker, queue) {
    return console.log("Polling for queue: " + queue);
  });
  worker.on('job', function(worker, queue, job) {
    return console.log('Attempting job; worker: ' + worker + ' queue: ' + queue + ' job: ' + job);
  });
  exports.start = function() {
    console.log("Launching worker...");
    return worker.start();
  };
}).call(this);
