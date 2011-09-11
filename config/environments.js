(function() {
  var app, express;
  app = require('../config/app').app;
  express = require('../config/app').express;
  app.configure('test', 'development', function() {
    return app.use(express.errorHandler({
      dumpExceptions: true,
      showStack: true
    }));
  });
  app.configure('production', function() {
    return app.use(express.errorHandler);
  });
  app.configure('development', 'production', function() {
    var sockets;
    return sockets = require('../lib/sockets');
  });
}).call(this);
