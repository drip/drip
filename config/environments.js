(function() {
  var app, express;
  app = require('../app').app;
  express = require('../app').express;
  app.configure('test', 'development', function() {
    return app.use(express.errorHandler({
      dumpExceptions: true,
      showStack: true
    }));
  });
  app.configure('production', function() {
    return app.use(express.errorHandler);
  });
}).call(this);
