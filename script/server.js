(function() {
  var port;
  if (process.env.NODE_ENV === 'production') {
    port = 80;
  } else {
    port = process.env.PORT || 8000;
  }
  require('../config/app').start(process.env.PORT);
}).call(this);
