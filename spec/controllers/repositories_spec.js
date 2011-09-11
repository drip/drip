(function() {
  var Repository, RepositoryFactory, assert, client, jsonHeaders, should, tobi, vows;
  vows = require('../spec_helper').vows;
  client = require('../spec_helper').client;
  tobi = require('../spec_helper').tobi;
  assert = require('../spec_helper').assert;
  should = require('../spec_helper').should;
  jsonHeaders = require('../spec_helper').headers.jsonHeaders;
  Repository = require('../../models/repository').Repository;
  RepositoryFactory = require('../spec_helper').factories.Repository;
  vows.describe('repositories').addBatch({
    'when creating a new repository': 'pending'
  }).addBatch({
    'with a repository': {
      topic: function() {
        var attributes;
        attributes = {
          name: "testrepo",
          ownerName: "testuser"
        };
        return RepositoryFactory.create(attributes, this.callback);
      },
      'when requesting the repository list': {
        topic: function() {
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
      topic: function() {
        var attributes;
        attributes = {
          name: "testrepo",
          ownerName: "testuser"
        };
        return RepositoryFactory.create(attributes, this.callback);
      },
      'when requesting the repository list by name': {
        topic: function() {
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
      topic: function() {
        var attributes;
        attributes = {
          name: "testrepo",
          ownerName: "testuser"
        };
        return RepositoryFactory.create(attributes, this.callback);
      },
      'when requesting one repository': {
        topic: function() {
          return tobi.get('/repositories/testuser/testrepo', this.callback);
        },
        'should respond with a 200 ok': function(response, $) {
          return response.should.have.status(200);
        },
        'should return a one repositories': function(response, $) {
          return response.body.should.be.an["instanceof"](Object);
        },
        'should contain the repository we just created': 'pending'
      }
    }
  }).addBatch({
    'with a repository': {
      topic: function() {
        var attributes;
        attributes = {
          name: "testrepo",
          ownerName: "testuser"
        };
        return RepositoryFactory.create(attributes, this.callback);
      },
      'when deleting repository': {
        topic: function() {
          return tobi.get('/repositories/testuser/deleterepo', this.callback);
        },
        'should respond with a 200 ok': function(response, $) {
          return response.should.have.status(200);
        },
        'should contain the repository we just created': 'pending'
      }
    }
  })["export"](module);
}).call(this);
