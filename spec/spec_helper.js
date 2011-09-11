(function() {
  var Repository, app;
  exports.app = app = require('../config/app').app;
  exports.vows = require('vows');
  exports.assert = require('assert');
  exports.should = require('should');
  exports.zombie = require('zombie');
  exports.zombie.browser = new exports.zombie.Browser({
    debug: false,
    runScripts: false
  });
  exports.tobi = require('tobi');
  exports.tobi.get = function(path, callback) {
    var browser;
    browser = exports.tobi.createBrowser(app);
    browser.get(path, {
      headers: exports.headers.jsonHeaders
    }, callback);
  };
  exports.headers = {};
  exports.headers.jsonHeaders = {
    'Content-Type': 'application/json'
  };
  Repository = require('../models/repository').Repository;
  exports.factories = {};
  exports.factories.Repository = {};
  exports.factories.Repository.create = function(attributes, callback) {
    var repositories;
    repositories = new Repository(attributes);
    repositories.save(callback);
  };
}).call(this);
