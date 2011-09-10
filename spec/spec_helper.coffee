vows           = exports.vows   = require 'vows'
assert         = exports.assert = require 'assert'
tobi           = require 'tobi'
app            = require('../config/app').app
browser        = tobi.createBrowser(8000, 'localhost')
defaultHeaders = { 'Content-Type': 'application/json' }

exports.assertStatus = (code) ->
  (response, $) ->
    response.should.have.status(code)

exports.client =
  get: (path) ->
    () ->
      browser.get(path, { headers: defaultHeaders }, this.callback)

app.listen 8000
