app     = require('../app').app
express = require('../app').express

app.configure 'test', 'development', ->
  app.use express.errorHandler 
    dumpExceptions: true 
    showStack: true

app.configure 'production', ->
  app.use express.errorHandler
