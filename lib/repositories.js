var Repository  = require('../models/repository.js').Repository,
    Build       = require('../models/build.js').Build,
    resque      = require('../config/resque');

module.exports.findOrCreateRepository = function(desired_repository, callback) { 
  Repository.findOne({ ownerName: desired_repository.ownerName, name: desired_repository.name  }, function (err, repository) { 
    if (err) throw err;

    if (!repository) {
      var repository = new Repository(desired_repository);
    } else {
      repository.url = desired_repository.url;
    }

    repository.save(function (err) { 
      if (err) throw err; 
    });

    console.log("Found/created repository for " + repository.url);

    callback(err, repository);
  });
};

module.exports.triggerRepositoryBuild = function(repository, branch, callback) { 
  var build = new Build({ branch: branch });
  repository.builds.push(build);
  repository.save(function (err) { 
    if (err) throw err; 

    console.log("Scheduling build for " + repository.url + " and branch " + branch);

    resque.enqueue('builder', 'build', [{
      buildId: build.id,
      repositoryId: repository.id
    }]);

    callback();
  });
};
