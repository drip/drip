(function() {
  var Build, Repository, findOrCreateRepository, resque, triggerRepositoryBuild;
  Repository = require('../models/repository').Repository;
  Build = require('../models/build').Build;
  resque = require('../config/resque');
  findOrCreateRepository = require('../lib/repositories').findOrCreateRepository;
  triggerRepositoryBuild = require('../lib/repositories').triggerRepositoryBuild;
  exports.create = function(request, response) {
    var branch, repository;
    if (!request.body && req.is('application/json')) {
      console.log('Received invalid post: ', request.headers['content-type'], request.body);
      response.end();
      return;
    }
    branch = "master";
    repository = request.body.repository;
    repository.ownerName = repository.owner.name;
    delete repository.owner;
    if (repository.url.indexOf('http') === 0) {
      repository.url = repository.url.replace(/\.git$/, "");
    }
    return findOrCreateRepository(repository, function(err, repository) {
      return triggerRepositoryBuild(repository, branch, function() {
        return response.send("OK");
      });
    });
  };
  exports.list = function(request, response) {
    var ownerName;
    ownerName = request.params.ownerName;
    if (ownerName) {
      return Repository.find({
        ownerName: ownerName
      }, function(err, repositories) {
        if (err) {
          throw err;
        }
        return response.send(repositories);
      });
    } else {
      return Repository.find(function(err, repositories) {
        if (err) {
          throw err;
        }
        return response.send(repositories);
      });
    }
  };
  exports.show = function(request, response) {
    var name, ownerName;
    name = request.params.name;
    ownerName = request.params.ownerName;
    return Repository.findOne({
      ownerName: ownerName,
      name: name
    }, function(err, repository) {
      if (err) {
        throw err;
      }
      return response.send(repository);
    });
  };
}).call(this);
