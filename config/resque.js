var resque  = require('coffee-resque'),
    app     = require('../server');

module.exports = resque.connect({ 
  host: app.set('credentials').redis.host,
  port: app.set('credentials').redis.port,
  password: app.set('credentials').redis.pass
});

console.log('Connected to Redis');
