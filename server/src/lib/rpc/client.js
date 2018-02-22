const Client = require('bitcoin-core')
const configData = require('../../server-settings')

// Rpc.getBlockCount = () => Rpc.navClient.getBlockCount()

// Rpc.getInfo = () => Rpc.navClient.getInfo()

// Rpc.getWalletInfo = () => Rpc.navClient.getWalletInfo()

const rpc =  new Client(configData.navClient)

rpc.unlockWallet = () => rpc.walletPassphrase('password', 100000)

module.exports = rpc
