(function() {
  var RepositorySchema, app, io;
  app = require('../app').app;
  io = require('socket.io').listen(app);
  RepositorySchema = require('../models/repository').RepositorySchema;
  io.sockets.on('connection', function(socket) {
    return RepositorySchema.pre('save', function(next) {
      console.log('socket.io sending repository event');
      socket.emit('repository', {
        'repository': this
      });
      return next;
    });
  });
}).call(this);
