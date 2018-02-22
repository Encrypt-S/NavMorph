const client = require('./rpc/client')
const config = require('../server-settings')

const preflightCheckController = {}

preflightCheckController.startChecks = () => {
  return new Promise( async (fufill, reject) => {
    try {
      await client.unlockWallet()
      const walletInfo = await client.getInfo()
      if(!walletInfo.unlocked_until) {
        throw new Error('NavCoin wallet is locked.')
      }
      const networkBlockCount = await client.getBlockCount()
      if (networkBlockCount - walletInfo.blocks > config.preflightCheckController.maxBlockHeightDiscrepency ) {
        throw new Error(`Block height is out of sync:  networkBlockCount: ${networkBlockCount}, 
        reportedBlockHeight: ${walletInfo.blocks}. ${networkBlockCount - walletInfo.blocks} blocks out of sync.`)
      }
      console.log('hey I\'m wurking btw')
      fufill()
    } catch (err) {
      console.log('error: ', err);
      
      reject(err)
    }
  })
}

module.exports = preflightCheckController