(function() {
  var app, creds, mongoose;
  mongoose = require('mongoose');
  app = require('../config/app').app;
  creds = app.set('credentials').mongo;
  exports.Connection = mongoose.connect(creds.url, function(err) {
    if (err) {
      throw err;
    }
  });
}).call(this);
