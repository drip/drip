(function() {
  var port, spawn, worker;
  if (process.env.NODE_ENV === 'production') {
    port = 80;
  } else {
    port = process.env.PORT || 8000;
  }
  require('../config/app').start(port);
  spawn = require('child_process').spawn;
  worker = spawn('node', ['script/worker.js']);
  worker.stdout.on('data', function(data) {
    return process.stdout.write("worker: " + data);
  });
  worker.stderr.on('data', function(data) {
    return process.stderr.write("worker: " + data);
  });
  worker.on('exit', function(code) {
    return process.stdout.write("worker: " + data);
  });
}).call(this);
