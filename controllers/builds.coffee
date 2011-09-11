Redis       = require('../config/redis').Connection
Repository  = require('../models/repository').Repository
Build       = require('../models/build').Build

exports.list = (request, response) ->
  query =
    name:      request.params.name
    ownerName: request.params.ownerName

  Repository.findOne query, (err, repository) ->
    if err
      throw err

    if repository && repository.builds
      response.send repository.builds
    else
      response.end()

exports.show = (request, response) ->
  id    = request.params.id
  query =
    name:      request.params.name
    ownerName: request.params.ownerName

  Repository.findOne query, (err, repository) ->
    if err
      throw err

    if repository && repository.builds
      build = repository.builds.id id

      if build
        Redis.lrange "builds:" + build.id, 0, -1, (err, output) ->
          if err
            throw err

          build.output = output.join('')

          response.send build
      else
        response.end()
    else
      response.end()

