const Config = require('../server-settings')
let Logger = require('./logger') // eslint-disable-line prefer-const
const RpcGetNewAddress = require('./rpc/get-new-address')
const preflightCheckController = require('./preflightCheckController')

const ProcessHandler = {
  tasksRunning: false,
  timerPaused: false,
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
  ProcessHandler.processTimer = setInterval(ProcessHandler.runTasks, 10000)
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
  return new Promise((resolve, reject) => {
    if (!ProcessHandler.timerPaused && !ProcessHandler.tasksRunning) {
      console.log('timer not paused and no tasks running')
      ProcessHandler.tasksRunning = true
      preflightCheckController.startChecks()
      .then((balance) => {
        ProcessHandler.tasksRunning = false
        resolve(balance)
      })
      .catch((error) => {
        reject(error)
      })
    } else if(ProcessHandler.tasksRunning) {
      console.log('Preflight checks still running')
      resolve()
    } else {
      console.log('Timer is paused')
      clearInterval(ProcessHandler.processTimer)
      reject(new Error('Timer is paused'))
    }
    
  })
}

ProcessHandler.setTimerPaused = (newStatus) => {
  ProcessHandler.timerPaused = newStatus
}

module.exports = ProcessHandler
