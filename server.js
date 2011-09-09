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

var credentials   = require('./config/credentials'),
    routes        = require('./config/routes'),
    mongoose      = require('./config/mongoose'),
    sockets       = require('./lib/sockets'), 
    environments  = require('./config/environments');

// Configuration for port and setuid.
//
if(!module.parent) {
  app.listen(process.env.NODE_ENV === 'production' ? process.env.PORT : 8000, function() {
    console.log('Ready');

    if (process.getuid() === 0)
      require('fs').stat(__filename, function(err, stats) {
        if (err) return console.log(err)
        process.setuid(stats.uid);
      });

    console.log('Listening on ' + app.address().port);
  });
}
