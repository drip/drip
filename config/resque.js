var resque  = require('coffee-resque'),
    app     = require('../server');

module.exports = resque.connect({ 
  host: app.set('credentials').redis.host
});

console.log('Connected to Redis');
