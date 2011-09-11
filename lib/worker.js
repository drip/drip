(function() {
  exports.workerCleanup = function() {
    return Repository.find({}, function(err, repositories) {
      if (err) {
        throw err;
      }
      console.log('Looking for hung builds.');
      return repositories.forEach(function(repository) {
        console.log('Found repo: ' + repository.url);
        return repository.builds.forEach(function(build) {
          console.log('Found build: ' + build.id);
          if (build.running) {
            build.completed = true;
            build.running = false;
            build.successful = false;
            build.finishedAt = Date.now();
            return repository.save(function(err) {
              if (err) {
                throw err;
              }
              return console.log('Marked in-progress build as finished.');
            });
          }
        });
      });
    });
  };
}).call(this);
