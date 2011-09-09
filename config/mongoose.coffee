mongoose = require 'mongoose'
app      = require('../app').app
creds    = app.set('credentials').mongo

exports = mongoose.connect creds.url, (err) ->
  if err
    throw err
