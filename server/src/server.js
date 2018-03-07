// Get dependencies
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')
const https = require('https')
const http = require('http')
const pem = require('pem')
const mongoose = require('mongoose')
const auth = require('basic-auth')


const socketCtrl = require('./lib/socket/socketCtrl')
const config = require('./server-settings')
const settingsValidator = require('./lib/settingsValidator.js')
const processHandler = require('./lib/processHandler')

// Get our API routes
const api = require('./api')
const logger = require('./lib/logger')
const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
const port = process.env.PORT || config.serverPort

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


  // Set our api routes
  app.use(config.app.apiUri, api)

  /**
   * Connect to mongoose
   */
  try {
    mongoose.Promise = global.Promise
    const mongoDB = config.mongoDBUrl
    await mongoose.connect(mongoDB, { useMongoClient: true })
    const db = mongoose.connection
    db.on('error', console.error.bind(console, 'MongoDB connection error:'))

    logger.writeLog(`Conected to MongoDB on ${mongoDB}`, 'MongoDB Connect')
  } catch (error) {
    logger.writeErrorLog('Failed to connect to MongoDB', '002', err, true)
    return
  }

  logger.writeLog(`Start Up Complete @ ${new Date().toISOString()}, NavMorph Version: ${config.version}`, 'Server Start Up', true)

  /**
   * Setup the process handler
   */
  const setupSuccess = processHandler.setup()
  logger.writeLog('Process Handler Set Up')


  const socketServer = http.createServer(app)
  const io = require('socket.io')(socketServer)

  try {
    await socketCtrl.setupServerSocket(io)
    logger.writeLog('Server Mode Socket Running', )
  } catch(err) {
    return logger.writeErrorLog('001', 'Failed to start up Server Mode Socket', err, true)
  }
  //
  socketServer.listen(port, async () => {
    logger.writeLog(`API running on http://localhost:${port}`, )
  })

  /**
   * Create HTTPS server, set up sockets and listen on all network interfaces
   */

}

startUpServer()
