Mongoose    = require('mongoose').Connection
Schema      = <ongoose.Schema
ObjectId    = Schema.ObjectId
BuildSchema = require("./build").BuildSchema

exports.RepositorySchema = new Schema
	url:
		type: String
		index: true
		validate: (v) ->
			v.length > 0
	name:
		type: String
		index: true
		validate: (v) ->
			v.length > 0
	ownerName:
		type: String
		index: true
		validate: (v) ->
			v.length > 0
	builds: [BuildSchema]

exports.Repository = Mongoose.model 'Repository', exports.RepositorySchema

exports.Repository.prototype.toJSON = ->
  obj = this.toObject
  if obj.builds
    obj.builds = obj.builds.reverse
  obj
