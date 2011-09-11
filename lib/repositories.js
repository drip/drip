(function() {
  var Build, Repository, Resque;
  Repository = require('../models/repository').Repository;
  Build = require('../models/build').Build;
  Resque = require('../config/resque').Connection;
  exports.findOrCreateRepository = function(desired_repository, callback) {
    var query;
    query = {
      name: desired_repository.name,
      ownerName: desired_repository.ownerName
    };
    return Repository.findOne(query, function(err, repository) {
      if (err) {
        throw err;
      }
      if (!repository) {
        repository = new Repository(desired_repository);
      }
      repository.url = desired_repository.url;
      repository.save(function(err) {
        if (err) {
          throw err;
        }
      });
      console.log('Found/created repository for ' + repository.url);
      return callback(repository);
    });
  };
  exports.triggerRepositoryBuild = function(repository, branch, callback) {
    var build;
    console.log("Trigger repository build called for repository: " + repository.id + " branch: " + branch);
    build = new Build({
      branch: branch
    });
    repository.builds.push(build);
    console.log("Build created " + build.id);
    return repository.save(function(err) {
      if (err) {
        throw err;
      }
      console.log("Scheduling build " + build.id + " for " + repository.url + "/" + branch);
      Resque.enqueue('builder', 'build', [
        {
          buildId: build.id,
          repositoryId: repository.id
        }
      ]);
      return callback(build);
    });
  };
}).call(this);
