const validator = require('./settingsValidator')
const Client = require('./rpc/client')
const config = require('../server-settings')

const preflightCheckController = {}

preflightCheckController.startChecks = () => {
  return new Promise((fufill, reject) => {
    preflightCheckController.validateSettings()
    .then(() => {
      return preflightCheckController.daemonGetInfo()
    })
    .then((walletInfo) => {
      return preflightCheckController.daemonGetBlockCount({ 
        maxBlockHeightDiscrepency: config.maxBlockHeightDiscrepency, 
        walletBlockHeight: walletInfo.blocks
      })
    })
    .then(() => {
      return preflightCheckController.daemonCheckWalletUnlocked()
    }).then(() => {
      fufill()
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
    Client.getInfo()
    .then((walletInfo) => {
      console.log('walletInfo', walletInfo)  
      fufill(walletInfo)
    })
    .catch(error => reject(error))
  })
}

preflightCheckController.daemonGetBlockCount = (options) => {
  return new Promise((fufill, reject) => {
    Client.getBlockCount()
    .then((networkBlockCount) =>{
      console.log('networkBlockCount ' + networkBlockCount, 'reportedBlockHeight ' + options.walletBlockHeight)
      if(networkBlockCount - options.walletBlockHeight > options.maxBlockHeightDiscrepency) {
        reject(new Error("Block height is out of sync: ", 'networkBlockCount ' + networkBlockCount, 'reportedBlockHeight ' + options.walletBlockHeight))
        return
      }
      fufill()
    })
  })
}

preflightCheckController.daemonCheckWalletUnlocked = () => {
  return new Promise((fufill, reject) => {
    Client.walletPassphrase()
    .then(() =>{
      Client.getWalletInfo()
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