(function() {
  var Repository, assert, client, jsonHeaders, tobi, vows;
  vows = require('../spec_helper').vows;
  client = require('../spec_helper').client;
  tobi = require('../spec_helper').tobi;
  assert = require('../spec_helper').assert;
  jsonHeaders = require('../spec_helper').headers.jsonHeaders;
  Repository = require('../../models/repository').Repository;
  vows.describe('repositories').addBatch({
    'with a repository': {
      topic: function() {
        var repository;
        repository = new Repository({
          name: 'winston',
          ownerName: 'indexzero'
        });
        repository.save(this.callback);
      },
      'when creating a new repository': 'pending',
      'when deleting repository': 'pending',
      'when requesting the repository list': {
        topic: function(repository) {
          return tobi.get('/repositories', this.callback);
        },
        'should respond with a 200 ok': function(response, $) {
          return response.should.have.status(200);
        },
        'should return a list of repositories': function(response, $) {
          return response.body.should.be.an["instanceof"](Array);
        },
        'should contain the repository we just created': 'pending'
      },
      'when requesting the repository list by name': 'pending',
      'when requesting one repository': 'pending'
    }
  })["export"](module);
}).call(this);
