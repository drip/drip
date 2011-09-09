(function() {
  var Build, Repository, redis;
  redis = require('../config/redis');
  Repository = require('../models/repository').Repository;
  Build = require('../models/build').Build;
  exports.list = function(request, response) {
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
      if (repository && repository.builds) {
        return response.send(repository.builds);
      } else {
        return response.end();
      }
    });
  };
  exports.show = function(request, response) {
    var id, name, ownerName;
    id = request.params.id;
    name = request.params.name;
    ownerName = request.params.ownerName;
    return Repository.findOne({
      ownerName: ownerName,
      name: name
    }, function(err, repository) {
      var build;
      if (err) {
        throw err;
      }
      if (repository && repository.builds) {
        build = repository.builds.id(id);
        if (build) {
          return redis.lrange("builds:" + build.id, 0, -1, function(err, output) {
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
