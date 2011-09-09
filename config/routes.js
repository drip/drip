(function() {
  var Builds, Index, Receiver, Repositories, app;
  app = require('../app').app;
  Index = require('../controllers/index');
  Repositories = require('../controllers/repositories');
  Builds = require('../controllers/builds');
  Receiver = require('../controllers/receiver');
  app.get('/', Index.index);
  app.post('/', Receiver.receive);
  app.get('/repositories', Repositories.list);
  app.post('/repositories', Repositories.create);
  app.get('/repositories/:ownerName', Repositories.list);
  app.get('/repositories/:ownerName/:name', Repositories.show);
  app.get('/repositories/:ownerName/:name/builds', Builds.list);
  app.get('/repositories/:ownerName/:name/builds/:id', Builds.show);
  app.post('/receive', Receiver.receive);
}).call(this);
