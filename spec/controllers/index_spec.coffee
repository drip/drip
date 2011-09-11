vows         = require('../spec_helper').vows
client       = require('../spec_helper').client
tobi         = require('../spec_helper').tobi
jsonHeaders  = require('../spec_helper').headers.jsonHeaders

vows
	.describe('index')
	.addBatch

    'when requesting the index':
      topic: ->
        tobi.get('/', @callback)

      'should respond with a 200 ok': (response, $) ->
        response.should.have.status(200)

	.export(module)
