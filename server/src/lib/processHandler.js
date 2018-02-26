let logger = require('./logger') // eslint-disable-line prefer-const
const config = require('../server-settings')
const preflightCheckController = require('./preflightCheckController')

const processHandler = {
  tasksRunning: false,
  processTimer: undefined
}

processHandler.setup = async () => {
  try {
    await processHandler.testRpc()
    processHandler.startTimer()
    logger.writeLog('Setup Successful')
    return true
  } catch (err) {
    global.clearInterval(processHandler.processTimer)
    logger.writeErrorLog('PH_001', 'Setup Failed', err, true)
    return false
  }
}

processHandler.testRpc = () => { // TODO: Complete this function
  return new Promise((fulfill, reject) => {
    fulfill()
  })
}

processHandler.startTimer = () => {
  processHandler.processTimer = global.setInterval(processHandler.runTasks, config.processHandler.timerLength)
}

processHandler.runTasks = async () => {
  try {
    const passedChecks = await processHandler.preflightChecks()
    return passedChecks
  }
  catch (err) {
    global.clearInterval(processHandler.processTimer)
    const errData = {
      stackTrace: err.stack,
    }
    logger.writeErrorLog('PH_002', 'Failed to pass preflightChecks', errData , true)
  }
}

processHandler.preflightChecks = async () => {
  if (!processHandler.tasksRunning) {
    processHandler.tasksRunning = true
    const balance = await preflightCheckController.startChecks()
    processHandler.tasksRunning = false
    return balance
  }

  return undefined
}

module.exports = processHandler
