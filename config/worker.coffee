sys         = require('sys')
Spawn       = require('child_process').spawn
Git         = require('git-fs')
Repository  = require('../models/repository').Repository
Build       = require('../models/build').Build
Resque      = require('../config/resque').Connection
mongoose    = require('../config/mongoose')
Redis       = require('../config/redis').Connection
ObjectId    = require('mongoose').Types.ObjectId

Jobs =
  succeed: (arg, callback) ->
    callback()

  fail: (arg, callback) ->
    callback new Error 'fail'

  build: (build, callback) ->
    buildId         = build.buildId
    repositoryId    = build.repositoryId
    cmds            = {}
    outputBuffer    = []
    stepsSuccessful = false
    workingDir      = ""

    console.log 'Build called; repositoryId: ' + repositoryId + ' buildId: ' + buildId

    Repository.findOne { '_id': new ObjectId repositoryId  }, (err, repository) ->
      if err
        throw err

      console.log 'Repository found, id:['+repository._id+'] url:['+repository.url+'], num builds:['+repository.builds.length+']'
      
      workingDir = ['/tmp/', 'dripio', repository.ownerName, repository.name, Date.now()].join('_')

      buildRepository = repository

      build = repository.builds.id buildId

      buildStart = ->
        build.startedAt = Date.now()
        build.running   = true
        repository.save (err) ->
          if err
            throw err

          spawnCloneDir()

      spawnCloneDir = ->
        name = 'mkdir'
        console.log "making directory ["+workingDir+"]..."
        cmds[name] = Spawn('mkdir',['-vp',workingDir]) # Use 'fs' instead; http://nodejs.org/docs/v0.4.11/api/fs.html#fs.mkdir
        cmdOut.bind({name: name, next: spawnClone})

      spawnClone = ->
        name = 'clone'
        console.log "cloning ["+repository.url+"]..."
        cmds[name] = Spawn('git', ['clone', repository.url, workingDir], { cwd: workingDir, setsid: false })
        cmdOut.bind({name: name, next: spawnCheckout})
      
      # TODO: Replace this with git-fs?
      spawnCheckout = ->
        name = 'checkout'
        console.log "checkout ["+build.branch+"]..."
        cmds[name] = Spawn('git', ['checkout',build.branch], {cwd: workingDir, setsid: false})
        cmdOut.bind({name: name, next: saveShaRef})
      
      saveShaRef = ->
        name = 'git_sha'
        foo = 'pickles'
        console.log "grabbing SHA for HEAD of ["+build.branch+"]"
        
        getHeadCallback = (noop,sha) ->
          console.log "got SHA ["+sha+"]"
          build.sha = sha
          spawnNpmInstall()
          
        Git workingDir
        Git.getHead(getHeadCallback, true);
        
        # repository.save (err) ->
        #   if err
        #     throw err
        # 

      spawnNpmInstall = ->
        name = 'npm_install'
        console.log("running npm install...")
        cmds[name] = Spawn('npm',['install'], {cwd: workingDir})
        cmdOut.bind({name: name, next: spawnNpmTest})

      spawnNpmTest = ->
        name = 'npm_test'
        console.log("running npm test...")
        cmds[name] = Spawn('npm',['test'], {cwd: workingDir})
        cmdOut.bind({name: name, next: buildFinish})

      buildFinish = ->
        build.finishedAt = Date.now()
        console.log("finishing build ["+build.finishedAt+"]...")
        cleanUp()
        build.completed  = true
        build.running    = false
        build.successful = stepsSuccessful
        repository.save (err) ->
          if err
            throw err
      
      cleanUp = ->
        name = 'cleanup'
        console.log "cleaning-up: ["+workingDir+"]"
        cmds[name] = Spawn('rm',['-rf', workingDir]) # Use 'fs' instead; loop and unlink, then remdir - http://nodejs.org/docs/v0.4.11/api/fs.html#fs.unlink & #fb.rmdir
        cmdOut.bind({name: name, skipExitBinding: true})

      cmdOut =
        bind: (opts) ->
          if !opts || !opts.name
            throw "bind needs minimally a name param"
            
          name = opts.name
          next = opts.next

          spawn = cmds[name]
          this.stdout(spawn,name)
          this.stderr(spawn,name)
          
          if !opts.skipExitBinding
            this.exit(spawn,name,next)

        stdout: (spawn, name) ->
          spawn.stdout.on 'data', (data) ->
            console.log 'stdout '+name+' ['+workingDir+']: ' + data
            Redis.rpush "builds:" + build.id, data, ->
              console.log "Issued write to redis"
            outputBuffer.push data

        stderr: (spawn, name) ->
          spawn.stderr.on 'data', (data) ->
            console.log 'stderr '+name+' ['+workingDir+']: ' + data
            Redis.rpush "builds:" + build.id, data, ->
              console.log "Issued write to redis"
            outputBuffer.push data

        exit: (spawn, name, next) ->
          spawn.on 'exit', (code) ->
            console.log 'exit '+name+' ['+workingDir+'] code: ' + code
            
            hasNext = (typeof(next) == "function")
           
            buildRepository.save (err) ->
              if err
                throw err
            
            if code != 0 || !hasNext
              cleanUp()
            
            if code == 0
              console.log 'clean exit; calling next() if present'
              stepsSuccessful = true
              
              if hasNext
                next()
                
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

      buildStart()
    
      console.log 'Build finished.'

      callback(build)

worker        = Resque.worker('builder', Jobs)
workerCleanup = require('../lib/worker').workerCleanup

worker.on 'poll', (worker, queue) ->
  console.log "Polling for queue: #{queue}"

worker.on 'job', (worker, queue, job) ->
  console.log 'Attempting job; worker: ' + worker + ' queue: ' + queue + ' job: ' + job

exports.start = () ->
  console.log "Launching worker..."
  worker.start()
