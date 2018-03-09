const Client = require('bitcoin-core')
const configData = require('../../server-settings')

let rpc = new Client(configData.navClient)
rpc.nav = {}

rpc.nav.unlockWallet = async () => {
  try {
    await rpc.walletPassphrase(config.navClient.walletPassphrase, config.navClient.walletUnlockTime)
    return true
  } catch (err) {
    if (err.message.includes('unencrypted')) {
      // wallet wasn't encrypted, therefore we can treat it as unlocked
      return true
    }
    logger.writeErrorLog('RPC_001', err.message, err)
    return false
  }
}

rpc.nav.getNewAddress = async () => {
  try {
    return await rpc.getNewAddress()
  } catch (err) {
    if (err.code === -12) {
      // We're out of addresses in our prestocked pool. Try refill
      try {
        await rpc.keypoolRefill()
        return await rpc.getNewAddress()
      } catch (err2) {
        // Errored again. Guess we can't refill it
        logger.writeErrorLog('RPC_002', err.message, err)
        return false
      }
    } else {
      logger.writeErrorLog('RPC_003', err.message, err)
      return false
    }
  }
}

module.exports = rpc
