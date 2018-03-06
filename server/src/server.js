// Get dependencies
const express = require('express')
const path = require('path')
const https = require('https')
const http = require('http')
const bodyParser = require('body-parser')
const cors = require('cors')
const pem = require('pem')
const mongoose = require('mongoose')
const socketCtrl = require('./lib/socket/socketCtrl')
const auth = require('basic-auth')
const config = require('./server-settings')
const settingsValidator = require('./lib/settingsValidator.js')
const processHandler = require('./lib/processHandler')

// Get our API routes
const api = require('./routes/api')
const Logger = require('./lib/logger')
const app = express()

  
const startUpServer = async () => {
  /**
    * Validate Server Settings Config
    */

  try {
    await settingsValidator.validateSettings(config)
    console.log('--------------------------------------------')
    console.log('Server Config Validated. Continuing start up')
    console.log('--------------------------------------------')
  } catch(err) {
    console.log('--------------------------------------------')
    console.log('ERR: Server Config invalid. Stopping start up')
    console.log(err)
    console.log('--------------------------------------------')
    return 
  }

  // Parsers for POST data
  app.use(bodyParser.json())
  app.use(cors())
  app.use(bodyParser.urlencoded({ extended: false }))

  app.use((req, res, next) => {
    const user = auth(req)
    // if (user === undefined || user.name !== config.basicAuth.name || user.pass !== config.basicAuth.pass) {
    //   res.send('unauthorised access attempt')
    //   return
    // }
    next()
  })


  // Point static path to dist
  app.use(express.static(path.join(__dirname, config.app.static)))

  // Set our api routes
  app.use(config.app.apiUri, api)

  // Catch all other routes and return the index file
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, config.app.catchAllUri))
  })

  /**
   * Get port from environment and store in Express.
   */
  const port = process.env.PORT || config.serverPort
  app.set('port', port)

  /**
   * Create HTTPS server, set up sockets and listen on all network interfaces
   */

  var server
  var socketObj

  pem.createCertificate({ days: 1, selfSigned: true }, async (error, keys) => {
    if (error) {
      console.log('pem error: ' + error)
    }
    const sslOptions = {
      key: keys.serviceKey,
      cert: keys.certificate,
      requestCert: false,
      rejectUnauthorized: false,
    }
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({
      extended: true,
    }))
    server = http.createServer(app)
    socketObj = require('socket.io')(server)
    try {
      await socketCtrl.setupServerSocket(socketObj)
      Logger.writeLog('Server Mode Socket Running', )
    } catch(err) {
      Logger.writeErrorLog('001', 'Failed to start up Server Mode Socket', err, true)
      return
    }

    server.listen(port, async () => {
      Logger.writeLog(`API running on http://localhost:${port}`, )

      /**
      * Connect to mongoose
      */
      try {
        mongoose.Promise = global.Promise
        const mongoDB = config.mongoDBUrl
        await mongoose.connect(mongoDB, { useMongoClient: true })
        const db = mongoose.connection
        db.on('error', console.error.bind(console, 'MongoDB connection error:'))

        Logger.writeLog(`Conected to MongoDB on ${mongoDB}`, 'MongoDB Connect')
      } catch (error) {
        Logger.writeErrorLog('Failed to connect to MongoDB', '002', err, true)
        return
      }
      Logger.writeLog('Sending start up notification email.')
      Logger.writeLog('Start Up Complete @' + new Date().toISOString() +
        ', Polymorph Version: ' + config.version, 'Server Start Up', true)

      /**
      * Setup the process handler
      */
      const setupSuccess = processHandler.setup()
      Logger.writeLog('Process Handler Set Up')
    })
  })
}

startUpServer()