Repository  = require('../models/repository').Repository
Build       = require('../models/build').Build
Resque      = require('../config/resque').Connection

exports.findOrCreateRepository = (desired_repository, callback) ->
  query =
    name:      desired_repository.name
    ownerName: desired_repository.ownerName

  Repository.findOne query, (err, repository) ->
    if err
      throw err

    if !repository
      repository = new Repository desired_repository

    repository.url = desired_repository.url

    repository.save (err) ->
      if err
        throw err

    # Callback needs to be outside of the save block, as we always want
    # to return the repository we've found in the callback,
    # regardless.
    console.log 'Found/created repository for ' + repository.url
    callback(repository)

exports.triggerRepositoryBuild = (repository, branch, callback) ->
  console.log "Trigger repository build called for repository: #{repository.id} branch: #{branch}"

  build = new Build
    branch: branch

  repository.builds.push(build)

  console.log "Build created #{build.id}"

  repository.save (err) ->
    if err
      throw err
    
    console.log "Scheduling build #{build.id} for #{repository.url}/#{branch}"

    Resque.enqueue 'builder', 'build', [
      buildId:      build.id,
      repositoryId: repository.id
    ]

    callback(build)
