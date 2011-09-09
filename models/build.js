(function() {
  var ObjectId, Schema, mongoose;
  mongoose = require('mongoose');
  Schema = mongoose.Schema;
  ObjectId = Schema.ObjectId;
  exports.BuildSchema = new Schema({
    completed: {
      type: Boolean,
      index: true,
      "default": false
    },
    successful: {
      type: Boolean
    },
    running: {
      type: Boolean,
      "default": false
    },
    receivedAt: {
      type: Date,
      "default": Date.now
    }
  }, {
    type: Date,
    "default": Date.now
  }, {
    startedAt: {
      type: Date
    },
    finishedAt: {
      type: Date
    },
    branch: {
      type: String,
      "default": "master"
    },
    output: {
      type: String
    }
  });
  exports.Build = mongoose.model('Build', exports.BuildSchema);
}).call(this);
