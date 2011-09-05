var redis       = require('../config/redis.js'),
    Repository  = require('../models/repository.js').Repository,
    Build       = require('../models/build.js').Build;

module.exports.list = function (request, response) { 
  var name      = request.params.name,
      ownerName = request.params.ownerName;

  Repository.findOne({ ownerName: ownerName, name: name }, function (err, repository) { 
    if (err) throw err;
   
    if (repository && repository.builds) {
      response.send(repository.builds);
    } 
    else {
      reponse.end();
    }
  });
};

module.exports.show = function (request, response) { 
  var id        = request.params.id,
      name      = request.params.name,
      ownerName = request.params.ownerName;

  Repository.findOne({ ownerName: ownerName, name: name }, function (err, repository) { 
    if (err) throw err;

    if (repository && repository.builds) { 
      var build = repository.builds.id(id);

      if (build) {
        redis.lrange("builds:" + build.id, 0, -1, function(err, output) {
          if (err) throw err;

          build.output = output.join('');
          response.send(build);
        });
      } 
      else { 
        response.end();
      }
    } 
    else {
      response.end();
    }
  });
};
