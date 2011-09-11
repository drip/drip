exports.app    = app = require('../config/app').app

exports.vows   = require 'vows'
exports.assert = require 'assert'

exports.zombie         = require 'zombie'
exports.zombie.browser = new exports.zombie.Browser
  debug:      false
  runScripts: false

exports.tobi                = require 'tobi'

exports.tobi.get = (path, callback) ->
  browser = exports.tobi.createBrowser(app)
  browser.get(path, { headers: exports.headers.jsonHeaders }, callback)
  return

exports.headers             = {}
exports.headers.jsonHeaders = { 'Content-Type': 'application/json' }
