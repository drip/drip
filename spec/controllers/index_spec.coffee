vows         = require('../spec_helper').vows
client       = require('../spec_helper').client
assert       = require('../spec_helper').assert
assertStatus = require('../spec_helper').assertStatus

vows
	.describe('Index')
	.addBatch

		'GET /':
			topic: -> client.get('/')

			'should respond with a 200 ok': (topic) ->
				assertStatus(200)

	.export(module)
