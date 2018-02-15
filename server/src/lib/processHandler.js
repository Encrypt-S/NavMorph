const Config = require('../server-settings')
let Logger = require('./logger') // eslint-disable-line prefer-const
const RpcGetNewAddress = require('./rpc/get-new-address')
const preflightCheckController = require('./preflightCheckController')

const ProcessHandler = {
  tasksRunning: false,
  timerPaused: false,
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
      ProcessHandler.setTimerPaused(true)
      Logger.writeLog('PH_001', 'Failed to pass RPC pretimer check', err, true)
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
  global.setInterval(ProcessHandler.runTasks, 5000)
}

ProcessHandler.runTasks = () => { // TODO: Complete this function
  ProcessHandler.preflightChecks()
  .then(() => {

  })
  .catch((err) => {
    ProcessHandler.setTimerPaused(true)
    console.log(err)
    Logger.writeLog('PH_002', 'Failed to pass preflightChecks', err, true)
  })
}

ProcessHandler.preflightChecks = () => { // TODO: Complete this function
  return new Promise((fulfill, reject) => {
    if (!ProcessHandler.timerPaused && !ProcessHandler.tasksRunning) {
      preflightCheckController.startChecks()
      .then(() => {
        fulfill()
      })
      .catch((error) => {
        reject(error)
      })
    } else {
      reject(new Error('Preflight checks failed'))
    }
  })
}

ProcessHandler.setTimerPaused = (newStatus) => {
  ProcessHandler.timerPaused = newStatus
}

module.exports = ProcessHandler
