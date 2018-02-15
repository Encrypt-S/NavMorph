"use strict";

const Client = require('bitcoin-core')
const configData = require('../../server-settings')


let Rpc = { //eslint-disable-line
  navClient: new Client(configData.navClient),
  internal: {}
}

Rpc.getBlockCount = () => {
  return new Promise((fulfill, reject) => {
    Rpc.navClient.getBlockCount()
    .then(blockCount => fulfill(blockCount))
    .catch((err) => {
      reject(err)
    })
  })
}

Rpc.getInfo = () => {
  return new Promise((fulfill, reject) => {
    Rpc.navClient.getInfo()
    .then(address => fulfill(address))
    .catch((err) => {
      reject(err)
    })
  })
}

Rpc.getWalletInfo = () => {
  return new Promise((fulfill, reject) => {
    Rpc.navClient.getWalletInfo()
    .then(walletInfo => fulfill(walletInfo))
    .catch((err) => {
      reject(err)
    })
  })
}

Rpc.walletPassphrase = () => {
  return new Promise((fulfill, reject) => {
    Rpc.navClient.walletPassphrase('password', 100000)
    .then(walletInfo => fulfill(walletInfo))
    .catch((err) => {
      reject(err)
    })
  })
}

module.exports = Rpc
