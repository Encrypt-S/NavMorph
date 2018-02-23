const Config = require('../server-settings')
let Logger = require('./logger') // eslint-disable-line prefer-const
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
      clearInterval(ProcessHandler.processTimer)
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
    clearInterval(ProcessHandler.processTimer)
    console.log(err)
    Logger.writeLog('PH_002', 'Failed to pass preflightChecks', err, true)
  })
}

ProcessHandler.preflightChecks = () => { // TODO: Complete this function
  return new Promise((resolve, reject) => {
    if (!ProcessHandler.tasksRunning) {
      console.log('timer not paused and no tasks running')
      ProcessHandler.tasksRunning = true
      preflightCheckController.startChecks()
      .then((balance) => {
        ProcessHandler.tasksRunning = false
        resolve(balance)
      })
      .catch((err) => {
        console.log('caught an error in preflightCheckController.startChecks()')
        ProcessHandler.tasksRunning = false
        reject(err)
      })
    }
    console.log('Preflight checks still running')
    resolve()
  })
}

module.exports = ProcessHandler
