(function() {
  var app, client, creds, exports, redis;
  redis = require('redis');
  app = require('../app').app;
  creds = app.set('credentials').redis;
  client = redis.createClient(creds.port, creds.host);
  client.auth(app.set('credentials').redis.pass, function(err) {
    if (err) {
      throw err;
    }
    return console.log('Redis authenticated!');
  });
  client.on('error', function(err) {
    return console.log('Redis connection error: ' + err);
  });
  client.on('connect', function(err) {
    return console.log('Connected to Redis');
  });
  exports = client;
}).call(this);
