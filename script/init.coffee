# Initialize the application.
#
if process.env.NODE_ENV is 'production'
  port = 80
else
  port = process.env.PORT || 8000

require('../config/app').start port

# Initialize the worker.
#
spawn  = require('child_process').spawn
worker = spawn('node', ['script/worker.js'])

worker.stdout.on 'data', (data) ->
  process.stdout.write "worker: #{data}"

worker.stderr.on 'data', (data) ->
  process.stderr.write "worker: #{data}"

worker.on 'exit', (code) ->
  process.stdout.write "worker: #{data}"
