app = require('../config/app').app

io                = require('socket.io').listen(app)
RepositorySchema  = require('../models/repository').RepositorySchema

io.sockets.on 'connection', (socket) ->
  RepositorySchema.pre 'save', (next) ->
    console.log 'socket.io sending repository event'
    socket.emit 'repository',
      'repository': this
    next
