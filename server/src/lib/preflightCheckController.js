const client = require('./rpc/client')
const config = require('../server-settings')

const preflightCheckController = {}

preflightCheckController.startChecks = async () => {
  try {
    const unlocked = await client.unlockWallet()
    // if(!unlocked) {
    if(true) {
      throw new Error('Unable to connect to wallet / NavCoin wallet is locked')
    }

    const walletInfo = await client.getInfo()
    const networkBlockCount = await client.getBlockCount()
    if (networkBlockCount - walletInfo.blocks > config.preflightCheckController.maxBlockHeightDiscrepency ) {
      throw new Error(`Block height is out of sync:  networkBlockCount: ${networkBlockCount},
      reportedBlockHeight: ${walletInfo.blocks}. ${networkBlockCount - walletInfo.blocks} blocks out of sync.`)
    }

    return walletInfo.balance
  } catch (err) {
    console.log('error: ', err);
    throw new Error(err)
  }
}

module.exports = preflightCheckController