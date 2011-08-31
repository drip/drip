var mongoose  = require('mongoose'),
    Schema    = mongoose.Schema, 
    ObjectId  = Schema.ObjectId;

module.exports.BuildSchema = new Schema({ 
  completed:  { type: Boolean, index: true, default: false },
  successful: { type: Boolean },
  running:    { type: Boolean, default: false },
  receivedAt: { type: Date, default: Date.now },
  startedAt:  { type: Date },
  finishedAt: { type: Date },
  branch:     { type: String, default: "master" },
  output:     { type: String }
});

module.exports.Build = mongoose.model('Build', module.exports.BuildSchema);
