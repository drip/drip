var redis = require('redis'),
    app   = require('../server').app;

var client = redis.createClient(
  app.set('credentials').redis.port,
  app.set('credentials').redis.host
);

client.auth(app.set('credentials').redis.pass, function(err) {
  if(err) throw err;
  console.log("Redis authenticated!");
});

client.on("error", function (err) {
  console.log("Redis connection error: " + err);
});

client.on("connect", function (err) {
  console.log('Connected to Redis');
});

module.exports = client;
