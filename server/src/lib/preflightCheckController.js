const validator = require('./settingsValidator')
const client = require('./rpc/client')
const config = require('../server-settings')

const preflightCheckController = {}

preflightCheckController.startChecks = () => {
  return new Promise( async (fufill, reject) => {
    try {
      const validateSettings = preflightCheckController.validateSettings()
      await client.unlockWallet()
      const walletInfo = await client.getInfo()
      if(!walletInfo.unlocked_until) {
        throw new Error('NavCoin wallet is locked.')
      }
      const networkBlockCount = await client.getBlockCount()
      if (networkBlockCount - walletInfo.walletBlockHeight > config.maxBlockHeightDiscrepency) {
        throw new Error("Block height is out of sync: ", 'networkBlockCount ' + networkBlockCount, 'reportedBlockHeight ' + options.walletBlockHeight)
      }
      console.log('hey I\'m wurking btw')
      fufill()
    } catch (err) {
      console.log('error: ', err);
      
      reject(err)
    }
  })
}

preflightCheckController.validateSettings = () => {
  // TODO run validation
  return null
}

module.exports = preflightCheckController