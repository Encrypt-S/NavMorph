const Client = require('bitcoin-core')

let Rpc = { //eslint-disable-line
  navClient: new Client({
    username: 'navpi',
    password: 'securepass',
    port: 44444,
    host: '127.0.0.1',
  }),
}

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
