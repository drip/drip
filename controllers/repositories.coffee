Redis       = require('../config/redis').Connection
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

  findOrCreateRepository repository, (repository) ->
    triggerRepositoryBuild repository, branch, ->
      response.send "OK"

exports.list = (request, response) ->
  query =
    ownerName: request.params.ownerName

  if query && query.ownerName
    Repository.find query, (err, repositories) ->
      if err
        throw err
      
      response.send repositories
  else
    Repository.find {}, (err, repositories) ->
      if err
        throw err

      response.send repositories

exports.show = (request, response) ->
  query =
    name:      request.params.name
    ownerName: request.params.ownerName

  Repository.findOne query, (err, repository) ->
    if err
      throw err

    response.send repository

exports.destroy = (request, response) ->
  query =
    name:      request.params.name
    ownerName: request.params.ownerName

  Repository.findOne query, (err, repository) ->
    if err
      throw err

    if repository && repository.builds
      repository.builds.forEach (build) ->
        Redis.del("builds:" + build.id)

    repository.remove()
    response.end()
