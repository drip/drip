var mongoose    = require('mongoose'),
    Schema      = mongoose.Schema, 
    ObjectId    = Schema.ObjectId, 
    date        = require('date-utils'),
    BuildSchema = require("./build").BuildSchema;

module.exports.RepositorySchema = new Schema({ 
  url:        { type: String, index: true, validate: function(v) { return v.length > 0 } },
  name:       { type: String, index: true, validate: function(v) { return v.length > 0 } },
  ownerName:  { type: String, index: true, validate: function(v) { return v.length > 0 } },
  builds:     [BuildSchema]
});

module.exports.Repository = mongoose.model('Repository', module.exports.RepositorySchema);

module.exports.Repository.prototype.toJSON = function toJSON () { 
  var obj    = this.toObject();
  obj.builds = obj.builds.reverse();
  return obj; 
};
