module.exports.workerCleanup = function() { 
  Repository.find({}, function (err, repositories) { 
    if(err) throw err;

    console.log("Looking for hung builds.");

    repositories.forEach(function(repository) { 

      console.log("Found repo: " + repository.url);

      repository.builds.forEach(function(build) { 

        console.log("Found build: " + build.id);

        // Force all builds as finished when we start the worker if they
        // were mid stream.
        if(build.running) { 
          build.completed = true;
          build.running = false;
          build.successful = false;
          build.finishedAt = Date.now();
          repository.save(function (err) { 
            if (err) throw err; console.log("Marked in-progress build as finished."); 
          });
        }

      });
    });
  });
};
