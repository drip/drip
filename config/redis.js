(function() {
  var app, client, creds, redis;
  redis = require('redis');
  app = require('../config/app').app;
  creds = app.set('credentials').redis;
  client = redis.createClient(creds.port, creds.host);
  client.auth(app.set('credentials').redis.pass, function(err) {
    if (err) {
      throw err;
    }
  });
  client.on('error', function(err) {
    return console.log('Redis connection error: ' + err);
  });
  exports.Connection = client;
}).call(this);
