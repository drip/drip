Repository  = require('../models/repository').Repository
Build       = require('../models/build').Build

findOrCreateRepository = require('../lib/repositories').findOrCreateRepository
triggerRepositoryBuild = require('../lib/repositories').triggerRepositoryBuild

exports.create = (request, response) ->
  if !request.body && req.is('application/json')
    console.log 'Received invalid post: ', request.headers['content-type'], request.body
    response.end()
    return

  branch                = "master"
  repository            = request.body.repository
  repository.ownerName  = repository.owner.name
  delete repository.owner

  if repository.url.indexOf('http') == 0
    repository.url = repository.url.replace(/\.git$/,"")

  findOrCreateRepository repository, (err, repository) ->
    triggerRepositoryBuild repository, branch, ->
      response.send "OK"

exports.list = (request, response) ->
  ownerName = request.params.ownerName

  if ownerName
    Repository.find { ownerName: ownerName }, (err, repositories) ->
      if err
        throw err
      
      response.send repositories
  else
    Repository.find {}, (err, repositories) ->
      if err
        throw err

      response.send repositories

exports.show = (request, response) ->
  name      = request.params.name
  ownerName = request.params.ownerName

  Repository.findOne { ownerName: ownerName, name: name  }, (err, repository) ->
    if err
      throw err

    response.send repository
