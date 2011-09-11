(function() {
  var Build, Redis, Repository;
  Redis = require('../config/redis').Connection;
  Repository = require('../models/repository').Repository;
  Build = require('../models/build').Build;
  exports.list = function(request, response) {
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
        return response.send(repository.builds);
      } else {
        return response.end();
      }
    });
  };
  exports.show = function(request, response) {
    var id, query;
    id = request.params.id;
    query = {
      name: request.params.name,
      ownerName: request.params.ownerName
    };
    return Repository.findOne(query, function(err, repository) {
      var build;
      if (err) {
        throw err;
      }
      if (repository && repository.builds) {
        build = repository.builds.id(id);
        if (build) {
          return Redis.lrange("builds:" + build.id, 0, -1, function(err, output) {
            if (err) {
              throw err;
            }
            build.output = output.join('');
            return response.send(build);
          });
        } else {
          return response.end();
        }
      } else {
        return response.end();
      }
    });
  };
}).call(this);
