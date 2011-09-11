(function() {
  var BuildSchema, Mongoose, ObjectId, Schema;
  Mongoose = require('mongoose');
  Schema = Mongoose.Schema;
  ObjectId = Schema.ObjectId;
  BuildSchema = require("./build").BuildSchema;
  exports.RepositorySchema = new Schema({
    url: {
      type: String,
      index: true,
      validate: function(v) {
        return v.length > 0;
      }
    },
    name: {
      type: String,
      index: true,
      validate: function(v) {
        return v.length > 0;
      }
    },
    ownerName: {
      type: String,
      index: true,
      validate: function(v) {
        return v.length > 0;
      }
    },
    builds: [BuildSchema]
  });
  exports.Repository = Mongoose.model('Repository', exports.RepositorySchema);
  exports.Repository.prototype.toJSON = function() {
    var obj;
    obj = this.toObject();
    if (obj.builds && obj.builds.length) {
      obj.builds = obj.builds.reverse();
    }
    return obj;
  };
}).call(this);
