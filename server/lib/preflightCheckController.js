const Validator = require('./settingsValidator')
const RPCClient = require('./rpc/client')
const Config = require('../server-settings')

const preflightCheckController = {}

preflightCheckController.startChecks = () => {
  return new Promise((fufill, reject) => {
    preflightCheckController.validateSettings()
    .then(() => {
      return preflightCheckController.daemonGetInfo()
    })
    .then((reportedBlockHeight) => {
      return preflightCheckController.daemonGetBlockCount({ 
        maxBlockHeightDiscrepency: Config.maxBlockHeightDiscrepency, 
        reportedBlockHeight
      })
    })
    .then(() => {
      return preflightCheckController.daemonCheckWalletUnlocked()
    })
    .catch(error => reject(error))
  })
  
}

preflightCheckController.validateSettings = () => {
  return new Promise((fufill, reject) => {
    fufill()
  })
}

preflightCheckController.daemonGetInfo = () => {
  return new Promise((fufill, reject) => {
    RPCClient.getInfo()
    .then((walletInfo) => {
      console.log('walletInfo', walletInfo)  
      fufill()
    })
    .catch(error => reject(error))
  })
}

preflightCheckController.daemonGetBlockCount = (options) => {
  return new Promise((fufill, reject) => {
    RPCClient.getBlockCount()
    .then((networkBlockCount) =>{
      console.log('networkBlockCount ' + networkBlockCount, 'reportedBlockHeight ' + options.reportedBlockHeight)
      if(networkBlockCount - options.reportedBlockHeight > options.maxBlockHeightDiscrepency) {
        reject(new Error("Block height is out of sync: ", 'networkBlockCount ' + networkBlockCount, 'reportedBlockHeight ' + options.reportedBlockHeight))
        return
      }
      fufill()
    })
  })
}

preflightCheckController.daemonCheckWalletUnlocked = () => {
  return new Promise((fufill, reject) => {
    RPCClient.walletPassphrase()
    .then(() =>{
      RPCClient.getWalletInfo()
      .then((walletInfoJSON) => {
        console.log('walletInfoJSON', walletInfoJSON)
        console.log('walletInfoJSON.unlocked_until', walletInfoJSON.unlocked_until)
        if(walletInfoJSON.unlocked_until > 0) {
          console.log('wallet unlocked')
          fufill()
        } else {
          reject(new Error('NavCoin wallet is locked.'))
        }
      })
    })
  })
}

module.exports = preflightCheckController