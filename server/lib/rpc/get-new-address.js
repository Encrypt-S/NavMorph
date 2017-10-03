const Rpc = require('./client')
const Logger = require('../logger')

const config = require('../../config')

Rpc.getNewAddress = (req, res) => {
  try {
    Rpc.navClient.getNewAddress().then((data) => {
      res.send(JSON.stringify({
        status: 200,
        type: 'SUCCESS',
        data,
      }))
    }).catch((err) => {
      const code = 'RPC_004'
      const message = 'something went wrong'
      res.send(JSON.stringify({
        status: 200,
        type: 'FAIL',
        code,
        message,
        err,
      }))
      Logger.writeLog(code, message, { error: err }, false)
    })
  } catch (err) {
    const code = 'RPC_003'
    const message = 'something went wrong'
    res.send(JSON.stringify({
      status: 200,
      type: 'FAIL',
      code,
      message,
      err,
    }))
    Logger.writeLog(code, message, { error: err }, false)
  }
}

Rpc.internal.getNewAddress = () => {
  return new Promise((fulfill, reject) => {
    try {
      const address = Rpc.navClient.getNewAddress()
      fulfill(address)
    } catch (firstGetAddressError) {
      if (firstGetAddressError.code === -12) {
        Rpc.internal.keypoolRefill()
        .then(() => {
          try {
            const address = Rpc.navClient.getNewAddress()
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

Rpc.internal.keypoolRefill = () => {
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
