(function() {
  var client, jsonHeaders, tobi, vows;
  vows = require('../spec_helper').vows;
  client = require('../spec_helper').client;
  tobi = require('../spec_helper').tobi;
  jsonHeaders = require('../spec_helper').headers.jsonHeaders;
  vows.describe('index').addBatch({
    'when requesting the index': {
      topic: function() {
        return tobi.get('/', this.callback);
      },
      'should respond with a 200 ok': function(response, $) {
        return response.should.have.status(200);
      }
    }
  })["export"](module);
}).call(this);
