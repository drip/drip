vows         = require('../spec_helper').vows
client       = require('../spec_helper').client
tobi         = require('../spec_helper').tobi
assert       = require('../spec_helper').assert
jsonHeaders  = require('../spec_helper').headers.jsonHeaders
Repository   = require('../../models/repository').Repository

vows
	.describe('repositories')
	.addBatch

    'with a repository':
      topic: ->
        repository = new Repository
          name:      'winston'
          ownerName: 'indexzero'
        repository.save @callback
        return

      'when creating a new repository': 'pending'

      'when deleting repository': 'pending'

      'when requesting the repository list':
        topic: (repository) ->
          tobi.get('/repositories', @callback)

        'should respond with a 200 ok': (response, $) ->
          response.should.have.status(200)

        'should return a list of repositories': (response, $) ->
          response.body.should.be.an.instanceof(Array)

        'should contain the repository we just created': 'pending'

      'when requesting the repository list by name': 'pending'

      'when requesting one repository': 'pending'

	.export(module)
