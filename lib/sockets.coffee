app = require('../config/app').app

io                = require('socket.io').listen(app)
RepositorySchema  = require('../models/repository').RepositorySchema

io.sockets.on 'connection', (socket) ->
  RepositorySchema.pre 'save', (next) ->
    socket.emit 'repository',
      'repository': this
    next()
