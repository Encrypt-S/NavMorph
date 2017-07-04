const Rpc = require('./client')

Rpc.getInfo = (req, res) => {
  try {
    Rpc.navClient.getInfo().then((data) => {
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

module.exports = Rpc
