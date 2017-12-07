"use strict";

const Rpc = require('./client')
let Logger = require('../logger')

Rpc.getInfo = (req, res) => {
  try {
    Rpc.navClient.getInfo().then((data) => {
      res.send(JSON.stringify({
        status: 200,
        type: 'SUCCESS',
        data,
      }))
    }).catch((err) => {
      const code = 'RPC_002'
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
    const code = 'RPC_001'
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

module.exports = Rpc
