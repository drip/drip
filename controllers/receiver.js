var Repository  = require('../models/repository.js').Repository,
    Build       = require('../models/build.js').Build,
    resque      = require('../config/resque');

var findOrCreateRepository = require('../lib/repositories.js').findOrCreateRepository,
    triggerRepositoryBuild = require('../lib/repositories.js').triggerRepositoryBuild;

module.exports.receive = function (request, response) {
  if (!request.body.payload && request.is('application/x-www-form-urlencoded')) { 
    console.log("Received invalid post:", request.headers['content-type'], request.body);
    response.end();
    return;
  }

  var payload           = JSON.parse(request.body.payload);
  var branch            = payload.ref.replace('refs/heads/', '');
  var repository        = payload.repository;
  repository.ownerName  = repository.owner.name;
  delete repository.owner;

  findOrCreateRepository(repository, function(err, repository) { 
    triggerRepositoryBuild(repository, branch, function() {
      response.send("OK");
    });
  });
};
