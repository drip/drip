var app = require('../server');

var io                = require('socket.io').listen(app),
    RepositorySchema  = require('../models/repository').RepositorySchema;

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

