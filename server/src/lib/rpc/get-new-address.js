"use strict";

const Rpc = require('./client')
const config = require('../../server-settings')

Rpc.getNewAddress = () => {
  return new Promise((fulfill, reject) => {
    try {
      const address = Rpc.getNewAddress()
      fulfill(address)
    } catch (firstGetAddressError) {
      if (firstGetAddressError.code === -12) {
        Rpc.keypoolRefill()
        .then(() => {
          try {
            const address = Rpc.getNewAddress()
            fulfill(address)
          } catch (secondGetAddressError) {
            reject(secondGetAddressError)
          }
        })
        .catch((keypoolError) => {
          reject(keypoolError)
        })
      } else {
        reject(firstGetAddressError)
      }
    }
  })
}

Rpc.keypoolRefill = () => {
  return new Promise((fulfill, reject) => {
    try {
      Rpc.navClient.walletPassphrase(config.walletKey, 5)
      Rpc.navClient.keypoolRefill()
      Rpc.navClient.walletLock()
      fulfill()
    } catch (error) {
      Rpc.navClient.walletLock()
      reject(error)
    }
  })
}

module.exports = Rpc
