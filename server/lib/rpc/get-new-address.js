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
  try {
    return Rpc.navClient.getNewAddress()
  } catch (e) {
    return e
  }
}

module.exports = Rpc
