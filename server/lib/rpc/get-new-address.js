const Rpc = require('./client')

Rpc.getNewAddress = (req, res) => {
  try {
    Rpc.navClient.getNewAddress().then((data) => {
      res.send(JSON.stringify({
        status: 200,
        type: 'SUCCESS',
        data,
      }))
    }).catch((e) => {
      res.send(JSON.stringify({
        status: 200,
        type: 'FAIL',
        code: 'RPC_002',
        message: 'something went wrong',
        error: e,
      }))
    })
  } catch (e) {
    res.send(JSON.stringify({
      status: 200,
      type: 'FAIL',
      code: 'RPC_001',
      message: 'something went wrong',
      error: e,
    }))
  }
}

Rpc.internal.getNewAddress = () => {
  return new Promise((fulfill, reject) => {
    try {
      const address = Rpc.navClient.getNewAddress()
      fulfill(address)
    } catch (firstGetAddressError) {
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
    }
  })
}

Rpc.internal.keypoolRefill = () => {
  return new Promise((fulfill, reject) => {
    try {
      Rpc.navClient.getNewAddress()
      fulfill()
    } catch (error) {
      reject(error)
    }
  })
}

module.exports = Rpc
