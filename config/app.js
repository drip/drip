(function() {
  var app, credentials, environments, express, mongoose, routes;
  express = exports.express = require('express');
  app = exports.app = express.createServer();
  app.configure(function() {
    app.set('views', __dirname + '/../views');
    app.use(express.static(__dirname + '/../public'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.logger());
    app.use(app.router);
    return app.set('view engine', 'jade');
  });
  credentials = require('./credentials');
  routes = require('./routes');
  mongoose = require('./mongoose');
  environments = require('./environments');
  exports.start = function(port) {
    return app.listen(port, function() {
      console.log('Ready');
      if (process.getuid() === 0) {
        require('fs').stat(__filename, function(err, stats) {
          return process.setuid(stats.uid);
        });
      }
      return console.log('Listening on ' + app.address().port);
    });
  };
}).call(this);
