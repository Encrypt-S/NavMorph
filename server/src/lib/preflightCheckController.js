let client = require('./rpc/client')
let config = require('../server-settings')

const preflightCheckController = {}

preflightCheckController.startChecks = async () => {
  const unlocked = await client.nav.unlockWallet()
  if (!unlocked) {
    throw new Error('Unable to connect to wallet / NavCoin wallet is locked')
  }

  const walletInfo = await client.getInfo()
  const networkBlockCount = await client.getBlockCount()
  if (networkBlockCount - walletInfo.blocks > config.preflightCheckController.maxBlockHeightDiscrepency) {
    throw new Error(`Block height is out of sync:  networkBlockCount: ${networkBlockCount},
    reportedBlockHeight: ${walletInfo.blocks}. ${networkBlockCount - walletInfo.blocks} blocks out of sync.`)
  }

  return walletInfo.balance
}

module.exports = preflightCheckController
