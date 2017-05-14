const Client = require('bitcoin-core')

let Rpc = { //eslint-disable-line
  navClient: new Client({
    username: 'navpi',
    password: 'securepass',
    port: 44444,
    host: '127.0.0.1',
  }),
}

Rpc.navcoinRpc = (req, res) => {
  if (!req.body || !req.body.command) {
    res.send(JSON.stringify({
      status: 200,
      type: 'FAIL',
      code: 'API_001',
      message: 'failed to receive command',
    }))
    return
  }
  try {
    Rpc.runCommand(req, res)
    return
  } catch (e) {
    res.send(JSON.stringify({
      status: 200,
      type: 'FAIL',
      code: 'API_002',
      message: 'something went wrong',
      error: e,
    }))
  }
}

Rpc.runCommand = (req, res) => {
  if (typeof Rpc.navClient[req.body.command] !== 'function') {
    res.send(JSON.stringify({
      status: 200,
      type: 'FAIL',
      code: 'API_003',
      message: 'parsed command is not a function',
      command: req.body.command,
    }))
    return
  }
  if (req.body.params && typeof Array.isArray(req.body.params)) {
    Rpc.navClient[req.body.command](...req.body.params).then((data) => {
      res.send(JSON.stringify({
        status: 200,
        type: 'SUCCESS',
        data,
      }))
    }).catch((error) => {
      res.send(JSON.stringify({
        status: 200,
        type: 'FAIL',
        code: error.code,
        message: error.message,
      }))
    })
    return
  }
  Rpc.navClient[req.body.command]().then((data) => {
    res.send(JSON.stringify({
      status: 200,
      type: 'SUCCESS',
      data,
    }))
  }).catch((error) => {
    res.send(JSON.stringify({
      status: 200,
      type: 'FAIL',
      code: error.code,
      message: error.message,
    }))
  })
}

module.exports = Rpc
