(function() {
  var BuildSchema, ObjectId, Schema, date, mongoose;
  mongoose = require('mongoose');
  Schema = mongoose.Schema;
  ObjectId = Schema.ObjectId;
  date = require('date-utils');
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
  exports.Repository = mongoose.model('Repository', exports.RepositorySchema);
  exports.Repository.prototype.toJSON = toJSON(function() {
    var obj;
    obj = this.toObject;
    obj.builds = obj.builds.reverse();
    return obj;
  });
}).call(this);
