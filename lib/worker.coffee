exports.workerCleanup = () ->
  Repository.find {}, (err, repositories) ->
    if err
      throw err

    console.log 'Looking for hung builds.'

    repositories.forEach (repository) ->
      console.log 'Found repo: ' + repository.url

      repository.builds.forEach (build) ->
        console.log 'Found build: ' + build.id

        if build.running
          build.completed  = true
          build.running    = false
          build.successful = false
          build.finishedAt = Date.now()

          repository.save (err) ->
            if err
              throw err

            console.log 'Marked in-progress build as finished.'
