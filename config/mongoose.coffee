mongoose = require 'mongoose'
app      = require('../config/app').app
creds    = app.set('credentials').mongo

exports.Connection = mongoose.connect creds.url, (err) ->
  if err
    throw err
