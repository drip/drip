(function() {
  var app, creds, exports, mongoose;
  mongoose = require('mongoose');
  app = require('../app').app;
  creds = app.set('credentials').mongo;
  exports = mongoose.connect(creds.url, function(err) {
    if (err) {
      throw err;
    }
  });
}).call(this);
