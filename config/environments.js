var app     = require('../server').app,
    express = require('../server').express;

app.configure('test', 'development', function() {
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function() {
  app.use(express.errorHandler()); 
});
