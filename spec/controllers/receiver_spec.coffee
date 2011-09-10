vows         = require('../spec_helper').vows
client       = require('../spec_helper').client
tobi         = require('../spec_helper').tobi
assert       = require('../spec_helper').assert
jsonHeaders  = require('../spec_helper').headers.jsonHeaders
Repository   = require('../../models/repository').Repository

vows
	.describe('receiver')
	.addBatch

    'should receive a github request at the root and schedule build': 'pending'
    'should receive a github request at the receiver and schedule build': 'pending'

  .export(module)
