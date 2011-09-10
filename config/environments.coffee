app     = require('../config/app').app
express = require('../config/app').express

app.configure 'test', 'development', ->
  app.use express.errorHandler
    dumpExceptions: true
    showStack: true

app.configure 'production', ->
  app.use express.errorHandler
  sockets = require '../lib/sockets'
