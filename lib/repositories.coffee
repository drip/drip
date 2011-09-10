Repository  = require('../models/repository').Repository
Build       = require('../models/build').Build
Resque      = require('../config/resque').Connection

exports.findOrCreateRepository = (desired_repository, callback) ->
  query =
    name:      desired_repository.name
    ownerName: desired_repository.ownername

  Repository.findOne query, (err, repository) ->
    if err
      throw err

    if !repository
      repository = new Repository desired_repository
    else
      repository.url = desired_repository.url

    repository.save (err) ->
      if err
        throw err

      console.log 'Found/created repository for ' + repository.url

      callback err, repository

exports.triggerRepositoryBuild = (repository, branch, callback) ->
  build = new Build
    branch: branch

  repository.builds.push build

  repository.save (err) ->
    if err
      throw err

    console.log 'Scheduling build for ' + repository.url + '/' + branch

    Resque.enqueue 'builder', 'build', [
      buildId: build.id,
      repositoryId: repository.id
    ]

    callback()
