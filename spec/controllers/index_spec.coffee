vows         = require('../spec_helper').vows
client       = require('../spec_helper').client
assert       = require('../spec_helper').assert
assertStatus = require('../spec_helper').assertStatus

vows
	.describe('index')
	.addBatch

    'when requesting the index':
      topic: -> client.get('/')

      'should respond with a 200 ok': (response) ->
        assertStatus(200)

	.export(module)
