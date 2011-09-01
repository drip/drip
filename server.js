var express = require('express'), 
    app     = module.exports = express.createServer();

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.use(express.static(__dirname + '/public'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.logger());
  app.use(app.router);
  app.set('view engine', 'jade');
});

// Environmental configuration.
//
app.configure('test', 'development', function() {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
  app.set('credentials', {
    redis: { host: 'localhost' }, 
    mongo: { url:  'mongodb://localhost/drip_development' } 
  });
});

app.configure('production', function() {
  app.use(express.errorHandler()); 
  app.set('credentials', {
    redis: { host: 'localhost' }, 
    mongo: { url:  'mongodb://localhost/drip' } 
  });
});

// Routing.
//
var Index        = require('./controllers/index.js');
    Repositories = require('./controllers/repositories.js');
    Builds       = require('./controllers/builds.js');
    Receiver     = require('./controllers/receiver.js');

app.get('/', Index.index);
app.post('/', Receiver.receive);

app.get('/repositories', Repositories.list);
app.post('/repositories', Repositories.create);
app.get('/repositories/:ownerName', Repositories.list);
app.get('/repositories/:ownerName/:name', Repositories.show);

app.get('/repositories/:ownerName/:name/builds', Builds.list);
app.get('/repositories/:ownerName/:name/builds/:id', Builds.show);

// Legacy hook.
app.post('/receive', Receiver.receive);

// Sockets.
//
var mongoose = require('./config/mongoose');

var io                = require('socket.io').listen(app),
    RepositorySchema  = require('./models/repository.js').RepositorySchema;

io.sockets.on('connection', function(socket) {
  RepositorySchema.pre('save', function(next) {
    console.log('socket.io sending repository event');
    socket.emit('repository', { 'repository': this }); 
    next();
  });

  socket.on('build', function (repository, build) {
    console.log('socket.io received build event');

    Repository.findOne({ ownerName: ownerName, name: name }, function (err, repository) { 
      if (err) throw err;

      var build = repository.builds.id(id);

      redis.lrange("builds:" + build.id, 0, -1, function(err, output) {
        if (err) throw err;

        console.log("Retrieved output from redis for build log!");

        build.output = output.join('');

        socket.emit('build', { 'build': this }); 
      });
    });
  });
});

// Configuration for port and setuid.
//
if(!module.parent) {
  app.listen(process.env.NODE_ENV === 'production' ? 80 : 8000, function() {
    console.log('Ready');

    if (process.getuid() === 0)
      require('fs').stat(__filename, function(err, stats) {
        if (err) return console.log(err)
        process.setuid(stats.uid);
      });

    console.log('Listening on ' + app.address().port);
  });
}
