const Rpc = require('./client')
const Logger = require('../logger')

Rpc.getInfo = (req, res) => {
  try {
    Rpc.navClient.getInfo().then((data) => {
      res.send(JSON.stringify({
        status: 200,
        type: 'SUCCESS',
        data,
      }))
    }).catch((error) => {
      const code = 'RPC_002'
      const message = 'something went wrong'
      res.send(JSON.stringify({
        status: 200,
        type: 'FAIL',
        code,
        message,
        error,
      }))
      Logger.writeLog(code, message, error, false)
    })
  } catch (error) {
    const code = 'RPC_001'
    const message = 'something went wrong'
    res.send(JSON.stringify({
      status: 200,
      type: 'FAIL',
      code,
      message,
      error,
    }))
    Logger.writeLog(code, message, error, false)
  }
}

module.exports = Rpc
