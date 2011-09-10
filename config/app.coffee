express = exports.express = require 'express'
app     = exports.app     = express.createServer()

app.configure ->
  app.set 'views', __dirname + '/../views'
  app.use express.static __dirname + '/../public' 
  app.use express.bodyParser()
  app.use express.methodOverride()
  app.use express.cookieParser()
  app.use express.logger()
  app.use app.router
  app.set 'view engine', 'jade'

credentials   = require './credentials'
routes        = require './routes'
mongoose      = require './mongoose'
environments  = require './environments'
sockets       = require '../lib/sockets'

exports.start = (port) -> 
  app.listen port, ->
    console.log('Ready');

    if process.getuid() == 0
      require('fs').stat __filename, (err, stats) ->
        process.setuid stats.uid 

    console.log 'Listening on ' + app.address().port
