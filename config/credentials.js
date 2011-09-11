(function() {
  var app, http, mongo_url, redis_uri, redis_url, url;
  app = require('../config/app').app;
  http = require('http');
  url = require('url');
  mongo_url = process.env.MONGO_URL;
  redis_url = process.env.REDIS_URL;
  redis_uri = url.parse(redis_url);
  app.set('credentials', {
    redis: {
      host: redis_uri.hostname,
      port: redis_uri.port,
      pass: redis_uri.auth.split(':')[1]
    },
    mongo: {
      url: mongo_url
    }
  });
}).call(this);
