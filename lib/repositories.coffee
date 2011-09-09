Repository  = require('../models/repository').Repository
Build       = require('../models/build').Build
resque      = require('../config/resque')

exports.findOrCreateRepository = (desired_repository, callback) ->
  Repository.findOne { ownerName: desired_repository.ownerName, name: desired_repository.name  }, (err, repository) ->
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

    resque.enqueue 'builder', 'build', [
      buildId: build.id,
      repositoryId: repository.id
    ]

    callback
