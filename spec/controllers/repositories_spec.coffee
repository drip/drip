vows         = require('../spec_helper').vows
client       = require('../spec_helper').client
tobi         = require('../spec_helper').tobi
assert       = require('../spec_helper').assert
jsonHeaders  = require('../spec_helper').headers.jsonHeaders
Repository   = require('../../models/repository').Repository

vows
	.describe('repositories')
	.addBatch

    'when creating a new repository': 'pending'
	
  .addBatch

    'with a repository':

      'when requesting the repository list':
        topic: (repository) ->
          tobi.get('/repositories', @callback)

        'should respond with a 200 ok': (response, $) ->
          response.should.have.status(200)

        'should return a list of repositories': (response, $) ->
          response.body.should.be.an.instanceof(Array)

        'should contain the repository we just created': 'pending'

	.addBatch

    'with a repository':

      'when requesting the repository list by name':
        topic: (repository) ->
          tobi.get('/repositories/testrepo', @callback)

        'should respond with a 200 ok': (response, $) ->
          response.should.have.status(200)

        'should return a list of repositories': (response, $) ->
          response.body.should.be.an.instanceof(Array)

        'should contain the repository we just created': 'pending'

	.addBatch

    'with a repository':

      'when requesting one repository':
        topic: (repository) ->
          tobi.get('/repositories/testuser/testrepo', @callback)

        'should respond with a 200 ok': (response, $) ->
          response.should.have.status(200)

        'should return a  of repositories': (response, $) ->
          response.body.should.be.an.instanceof(Object)

        'should contain the repository we just created': 'pending'

	.addBatch

    'with a repository':
    
      'when deleting repository': 'pending'

	.export(module)
