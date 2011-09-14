vows              = require('../spec_helper').vows
client            = require('../spec_helper').client
tobi              = require('../spec_helper').tobi
assert            = require('../spec_helper').assert
should            = require('../spec_helper').should
jsonHeaders       = require('../spec_helper').headers.jsonHeaders
Repository        = require('../../models/repository').Repository
RepositoryFactory = require('../spec_helper').factories.Repository

vows
	.describe('repositories')
	.addBatch

    'when creating a new repository': 'pending'
	
  .addBatch

    'with a repository':
      topic: ->
        attributes =
          name:      "testrepo"
          ownerName: "testuser"
        RepositoryFactory.create attributes, @callback

      'when requesting the repository list':
        topic: ->
          tobi.get '/repositories', @callback

        'should respond with a 200 ok': (response, $, repo) ->
          response.should.have.status(200)

        'should return a list of repositories': (response, $) ->
          $.should.be.an.instanceof(Array)

        'should contain the repository we just created': 'pending'

	.addBatch

    'with a repository':
      topic: ->
        attributes =
          name:      "testrepo"
          ownerName: "testuser"
        RepositoryFactory.create attributes, @callback

      'when requesting the repository list by name':
        topic: ->
          tobi.get '/repositories/testrepo', @callback

        'should respond with a 200 ok': (response, $) ->
          response.should.have.status(200)

        'should return a list of repositories': (response, $) ->
          response.body.should.be.an.instanceof(Array)

        'should contain the repository we just created': 'pending'

	.addBatch

    'with a repository':
      topic: ->
        attributes =
          name:      "testrepo"
          ownerName: "testuser"
        RepositoryFactory.create attributes, @callback

      'when requesting one repository':
        topic: ->
          tobi.get '/repositories/testuser/testrepo', @callback

        'should respond with a 200 ok': (response, $) ->
          response.should.have.status(200)

        'should return a one repositories': (response, $) ->
          response.body.should.be.an.instanceof(Object)

        'should contain the repository we just created': 'pending'

	.addBatch

    'with a repository':
      topic: ->
        attributes =
          name:      "testrepo"
          ownerName: "testuser"
        RepositoryFactory.create attributes, @callback
    
      'when deleting repository': 'pending'

	.export(module)
