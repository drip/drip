resque  = require 'coffee-resque'
app     = require('../app').app;
creds   = app.set('credentials').redis

exports = resque.connect
  host: creds.host
  port: creds.port
  password: creds.pass

console.log 'Connected to Redis'
