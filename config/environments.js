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
    var sockets;
    app.use(express.errorHandler);
    return sockets = require('../lib/sockets');
  });
}).call(this);
