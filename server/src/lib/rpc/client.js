const Client = require('bitcoin-core')

const config = require('../../server-settings')
let logger = require('../logger')
let rpc = new Client(config.navClient)

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
  console.log('Fired getNewAddressPolyMorph')
  try {
    return await rpc.getNewAddress()
  } catch (err) {
    console.log(err)
    if (firstGetAddressError.code === -12) {
      // Had a fixable error. Try fix it
      try {
        await rpc.keypoolRefill()
        return await rpc.getNewAddress()
      } catch (err2) {
        // Errored again. Guess we can't fix it
        logger.writeLog('RPC_002', err.message, err)
        return false
      }
    }
  }
}

module.exports = rpc
