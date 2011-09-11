(function() {
  var Build, Redis, Repository, findOrCreateRepository, triggerRepositoryBuild;
  Redis = require('../config/redis').Connection;
  Repository = require('../models/repository').Repository;
  Build = require('../models/build').Build;
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
    return findOrCreateRepository(repository, function(repository) {
      return triggerRepositoryBuild(repository, branch, function() {
        return response.send("OK");
      });
    });
  };
  exports.list = function(request, response) {
    var query;
    query = {
      ownerName: request.params.ownerName
    };
    if (query && query.ownerName) {
      return Repository.find(query, function(err, repositories) {
        if (err) {
          throw err;
        }
        return response.send(repositories);
      });
    } else {
      return Repository.find({}, function(err, repositories) {
        if (err) {
          throw err;
        }
        return response.send(repositories);
      });
    }
  };
  exports.show = function(request, response) {
    var query;
    query = {
      name: request.params.name,
      ownerName: request.params.ownerName
    };
    return Repository.findOne(query, function(err, repository) {
      if (err) {
        throw err;
      }
      return response.send(repository);
    });
  };
  exports.destroy = function(request, response) {
    var query;
    query = {
      name: request.params.name,
      ownerName: request.params.ownerName
    };
    return Repository.findOne(query, function(err, repository) {
      if (err) {
        throw err;
      }
      if (repository && repository.builds) {
        repository.builds.forEach(function(build) {
          return Redis.del("builds:" + build.id);
        });
      }
      repository.remove();
      return response.end();
    });
  };
}).call(this);
