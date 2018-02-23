const Config = require('../server-settings')
let logger = require('./logger') // eslint-disable-line prefer-const
const RpcGetNewAddress = require('./rpc/get-new-address')
const preflightCheckController = require('./preflightCheckController')

const ProcessHandler = {
  tasksRunning: false,
  processTimer: undefined
}

ProcessHandler.setup = () => {
  return new Promise((fulfill, reject) => {
    ProcessHandler.testRpc()
    .then(() => {
      ProcessHandler.startTimer()
      console.log('start timer')
      fulfill()
    })
    .catch((err) => {
      global.clearInterval(ProcessHandler.processTimer)
      logger.writeLog('PH_001', 'Failed to pass RPC pretimer check', err, true)
      reject()
    })
  })
}

ProcessHandler.testRpc = () => { // TODO: Complete this function
  return new Promise((fulfill, reject) => {
    fulfill()
  })
}

ProcessHandler.startTimer = () => {
  ProcessHandler.processTimer = global.setInterval(ProcessHandler.runTasks, 10000)
}

ProcessHandler.runTasks = async () => { // TODO: Complete this function
  try {
    const passedChecks = await ProcessHandler.preflightChecks()
    return passedChecks
  }
  catch (err) {
    global.clearInterval(ProcessHandler.processTimer)
    const errData = {
      stackTrace: err.stack,
    }
    logger.writeLog('PH_002', 'Failed to pass preflightChecks', errData , true)
  }
}

ProcessHandler.preflightChecks = async () => { // TODO: Complete this function
  if (!ProcessHandler.tasksRunning) {
    ProcessHandler.tasksRunning = true
    const balance = await preflightCheckController.startChecks()
    ProcessHandler.tasksRunning = false
    console.log('Preflight checks passed')
    return balance
  }

  console.log('Preflight checks still running')
  return undefined
}

module.exports = ProcessHandler
