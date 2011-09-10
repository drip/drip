redis   = require('redis')
app     = require('../config/app').app
creds   = app.set('credentials').redis

client = redis.createClient(creds.port, creds.host)

client.auth app.set('credentials').redis.pass, (err) ->
  if err
    throw err

client.on 'error', (err) ->
  console.log 'Redis connection error: ' + err

exports.Connection = client
