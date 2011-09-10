sys         = require('sys')
spawn       = require('child_process').spawn
Repository  = require('../models/repository').Repository
Build       = require('../models/build').Build
Resque      = require('../config/resque').Connection
mongoose    = require('../config/mongoose')
redis       = require('../config/redis')
ObjectId    = require('mongoose').Types.ObjectId

Jobs =
  succeed: (arg, callback) ->
    callback

  fail: (arg, callback) ->
    callback new Error 'fail'

  build: (build, callback) ->
    buildId         = build.buildId
    repositoryId    = build.repositoryId
    cmds            = {}
    outputBuffer    = []
    stepsSuccessful = false

    console.log 'Build called; repositoryId: ' + repositoryId + ' buildId: ' + buildId

    Repository.findOne { '_id': new ObjectId repositoryId  }, (err, repository) ->
      if err
        throw err

        console.log 'Repository found, id:['+repository._id+'] url:['+repository.url+'], num builds:['+repository.builds.length+']'
        
        buildRepository = repository

        build = repository.builds.id buildId

        buildStart = ->
          build.startedAt = Date.now()
          build.running   = true
          repository.save (err) ->
            if err
              throw err
            spawnCloneDir

        spawnCloneDir = ->
          name = 'mkdir'
          workingDir = ['/tmp/', 'dripio', repository.ownerName, repository.name, Date.now()].join('_')
          console.log "making directory ["+workingDir+"]..."
          cmds[name] = spawn('mkdir',['-vp',workingDir])
          cmdOut.bind(name, spawnClone)

        spawnClone = ->
          name = 'clone'
          console.log "cloning ["+repository.url+"]..."
          cmds[name] = spawn('git', ['clone',repository.url, workingDir], {cwd: workingDir, setsid: false})
          cmdOut.bind(name, spawnCheckout)
        
        spawnCheckout = ->
          name = 'checkout'
          console.log "checkout ["+build.branch+"]..."
          cmds[name] = spawn('git', ['checkout',build.branch], {cwd: workingDir, setsid: false})
          cmdOut.bind(name, spawnNpmInstall)

        spawnNpmInstall = ->
          name = 'npm_install'
          console.log("running npm install...")
          cmds[name] = spawn('npm',['install'], {cwd: workingDir})
          cmdOut.bind(name, spawnNpmTest)

        spawnNpmTest = ->
          name = 'npm_test'
          console.log("running npm test...")
          cmds[name] = spawn('npm',['test'], {cwd: workingDir})
          cmdOut.bind(name, buildFinish)

        buildFinish = ->
          name = 'finish'
          build.finishedAt = Date.now()
          console.log("finishing build and cleaning-up ["+build.finishedAt+"]...")
          build.completed  = true
          build.running    = false
          build.successful = stepsSuccessful
          repository.save (err) ->
            if err
              throw err
          
          cmds[name] = spawn('rm',['-vrf', workingDir])
          cmdOut.bind(name)

        cmdOut =
          bind: (name, next) ->
            spawn = cmds[name]
            this.stdout(spawn,name)
            this.stderr(spawn,name)
            this.exit(spawn,name,next)

          stdout: (spawn, name) ->
            spawn.stdout.on 'data', (data) ->
              console.log 'stdout '+name+' ['+workingDir+']: ' + data
              redis.rpush "builds:" + build.id, data, ->
                console.log "Issued write to redis"
              outputBuffer.push data

          stderr: (spawn, name) ->
            spawn.stderr.on 'data', (data) ->
              console.log 'stderr '+name+' ['+workingDir+']: ' + data
              redis.rpush "builds:" + build.id, data, ->
                console.log "Issued write to redis"
              outputBuffer.push data

          exit: (spawn, name, next) ->
            spawn.on 'exit', (code) ->
              console.log 'exit '+name+' ['+workingDir+'] code: ' + code
             
              buildRepository.save (err) ->
                if err
                  throw err
              
              if code == 0
                console.log 'clean exit; calling next() if present'
                stepsSuccessful = true
                
                if typeof(next) == 'function'
                  next
              else
                console.log 'unclean exit; not progressing to next, typeof: '+typeof(next)
                stepsSuccessful = false
                build.finishedAt = Date.now()

                console.log "finishing build at ["+build.finishedAt+"]..."
                build.completed  = true
                build.running    = false
                build.successful = stepsSuccessful
                repository.save (err) ->
                  if err
                    throw err

        buildStart
      
        console.log 'Build finished.'

        callback build

worker        = Resque.worker('builder', Jobs)
workerCleanup = require('../lib/worker').workerCleanup

worker.on 'job', (worker, queue, job) ->
  console.log 'Attempting job; worker: ' + worker + ' queue: ' + queue + ' job: ' + job

worker.start()
