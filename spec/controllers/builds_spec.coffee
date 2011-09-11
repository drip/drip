vows         = require('../spec_helper').vows
client       = require('../spec_helper').client
tobi         = require('../spec_helper').tobi
assert       = require('../spec_helper').assert
jsonHeaders  = require('../spec_helper').headers.jsonHeaders
Repository   = require('../../models/repository').Repository
Build        = require('../../models/repository').Build

vows
	.describe('builds')
	.addBatch

    'with a repository':
      topic: ->
        repository = new Repository
          name:      'winston'
          ownerName: 'indexzero'
        repository.save @callback
        return

        'with a build': 'pending'

	.export(module)
