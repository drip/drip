(function() {
  var Repository, assert, client, jsonHeaders, tobi, vows;
  vows = require('../spec_helper').vows;
  client = require('../spec_helper').client;
  tobi = require('../spec_helper').tobi;
  assert = require('../spec_helper').assert;
  jsonHeaders = require('../spec_helper').headers.jsonHeaders;
  Repository = require('../../models/repository').Repository;
  vows.describe('repositories').addBatch({
    'when creating a new repository': 'pending'
  }).addBatch({
    'with a repository': {
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
      }
    }
  }).addBatch({
    'with a repository': {
      'when requesting the repository list by name': {
        topic: function(repository) {
          return tobi.get('/repositories/testrepo', this.callback);
        },
        'should respond with a 200 ok': function(response, $) {
          return response.should.have.status(200);
        },
        'should return a list of repositories': function(response, $) {
          return response.body.should.be.an["instanceof"](Array);
        },
        'should contain the repository we just created': 'pending'
      }
    }
  }).addBatch({
    'with a repository': {
      'when requesting one repository': {
        topic: function(repository) {
          return tobi.get('/repositories/testuser/testrepo', this.callback);
        },
        'should respond with a 200 ok': function(response, $) {
          return response.should.have.status(200);
        },
        'should return a  of repositories': function(response, $) {
          return response.body.should.be.an["instanceof"](Object);
        },
        'should contain the repository we just created': 'pending'
      }
    }
  }).addBatch({
    'with a repository': {
      'when deleting repository': 'pending'
    }
  })["export"](module);
}).call(this);
