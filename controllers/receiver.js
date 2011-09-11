(function() {
  var Build, Repository, findOrCreateRepository, triggerRepositoryBuild;
  Repository = require('../models/repository.js').Repository;
  Build = require('../models/build.js').Build;
  findOrCreateRepository = require('../lib/repositories.js').findOrCreateRepository;
  triggerRepositoryBuild = require('../lib/repositories.js').triggerRepositoryBuild;
  exports.receive = function(request, response) {
    var branch, payload, repository;
    if (!request.body.payload && request.is('application/x-www-form-urlencoded')) {
      console.log('Received invalid post: ', request.headers['content-type'], request.body);
      response.end();
      return;
    }
    payload = JSON.parse(request.body.payload);
    branch = payload.ref.replace('refs/heads/', '');
    repository = payload.repository;
    repository.ownerName = repository.owner.name;
    delete repository.owner;
    return findOrCreateRepository(repository, function(err, repository) {
      return triggerRepositoryBuild(repository, branch, function() {
        return response.send("OK");
      });
    });
  };
}).call(this);
