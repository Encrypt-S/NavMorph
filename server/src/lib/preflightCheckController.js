const client = require('./rpc/client')
const config = require('../server-settings')

const preflightCheckController = {}

preflightCheckController.startChecks = () => {
  return new Promise( async (resolve, reject) => {
    try {
      const unlocked = await client.unlockWallet()
      if(!unlocked) {
        throw new Error('Unable to connect to wallet / NavCoin wallet is locked')
      }

      const walletInfo = await client.getInfo()
      const networkBlockCount = await client.getBlockCount()
      if (networkBlockCount - walletInfo.blocks > config.preflightCheckController.maxBlockHeightDiscrepency ) {
        throw new Error(`Block height is out of sync:  networkBlockCount: ${networkBlockCount},
        reportedBlockHeight: ${walletInfo.blocks}. ${networkBlockCount - walletInfo.blocks} blocks out of sync.`)
      }

      resolve(walletInfo.balance)
    } catch (err) {
      console.log('error: ', err);
      reject(err)
    }
  })
}

module.exports = preflightCheckController