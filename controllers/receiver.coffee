Repository  = require('../models/repository.js').Repository
Build       = require('../models/build.js').Build
resque      = require('../config/resque')

findOrCreateRepository = require('../lib/repositories.js').findOrCreateRepository
triggerRepositoryBuild = require('../lib/repositories.js').triggerRepositoryBuild

exports.receive = (request, response) ->
  if !request.body.payload && request.is('application/x-www-form-urlencoded')
    console.log 'Received invalid post: ', request.headers['content-type'], request.body
    response.end()
    return

  payload               = JSON.parse request.body.payload
  branch                = payload.ref.replace 'refs/heads/', ''
  repository            = payload.repository
  repository.ownerName  = repository.owner.name
  delete repository.owner

  findOrCreateRepository repository, (err, repository) ->
    triggerRepositoryBuild repository, branch, () ->
      response.send "OK"
