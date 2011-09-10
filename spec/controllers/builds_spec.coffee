vows         = require('../spec_helper').vows
client       = require('../spec_helper').client
assert       = require('../spec_helper').assert
assertStatus = require('../spec_helper').assertStatus
Repository   = require('../../models/repository.js').Repository
Build        = require('../../models/build.js').Build

vows
	.describe('builds')
	.addBatch

    'with a repository':
      topic: ->
        attributes =
          name:      'winston'
          ownerName: 'indexzero'
        repository = new Repository attributes

      'should have a repository': (repository) ->
        assert.isObject(repository)

      'when requesting builds':
        topic: (repository) ->
          client.get('/repositories/' + repository.ownerName + '/' + repository.name + '/builds')

        'should respond with a 200 ok': (response) ->
          assertStatus(200)

        'should return a list of resources': (response) ->
          assert.isArray response.body

      'and a build':
        topic: (repository) ->
          build = new Build
            branch: 'master'
          repository.builds.push build
          build

        'when requesting a build':
          topic: (repository, build) ->
            client.get('/repositories/' + repository.ownerName + '/' + repository.name + '/builds' + build.id)

          'should respond with a 200 ok': (response) ->
            assertStatus(200)

          'should return an object': (response) ->
            assert.isObject response.body
	
  .export(module)
