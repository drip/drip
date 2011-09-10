redis   = require('redis')
app     = require('../config/app').app
creds   = app.set('credentials').redis

client = redis.createClient(creds.port, creds.host)

client.auth app.set('credentials').redis.pass, (err) ->
  if err
    throw err
  console.log 'Redis authenticated!'

client.on 'error', (err) ->
  console.log 'Redis connection error: ' + err

client.on 'connect', (err) ->
  console.log 'Connected to Redis'

exports = client
