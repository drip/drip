var mongoose = require('mongoose'),
    app      = require('../server'),
    url      = app.set('credentials').mongo.url;

module.exports = mongoose.connect(url, function(err) { 
  if (err) throw err;
  console.log('Connected to Mongo');
});
