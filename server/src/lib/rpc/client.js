const Client = require('bitcoin-core')

const config = require('../../server-settings')
let logger = require('../logger')
let rpc = new Client(config.navClient)

rpc.unlockWallet = async () => {
  try {
    await rpc.walletPassphrase(config.navClient.walletPassphrase, config.navClient.walletUnlockTime)
    return true
  } catch (err) {
    if (err.message.includes('unencrypted')) {
      // wallet wasn't encrypted. Already unlocked
      return true
    }
    logger.writeLog('client.js', err.message, err)
    return false
  }
}

module.exports = rpc
