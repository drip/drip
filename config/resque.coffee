resque  = require 'coffee-resque'
app     = require('../config/app').app
creds   = app.set('credentials').redis

exports.Connection = resque.connect
  host: creds.host
  port: creds.port
  password: creds.pass

console.log 'Connected to Redis'
