const lodash = require('lodash')

// Compile model from schema
let ServerModeModel = require('./serverMode.model')
let ServerMessageModel = require('./serverMessage.model')

const ServerModeCtrl = {}

ServerModeCtrl.checkMode = () => {
  return new Promise((fulfill, reject) => {
    ServerModeModel.find({})
    ServerModeModel.select('server_mode')
    ServerModeModel.exec()
    .then((modeStatus) => { fulfill(modeStatus) })
    .catch((error) => { reject(error) })
  })
}

ServerModeCtrl.checkMessage = () => {
  return new Promise((fulfill, reject) => {
    ServerMessageModel.find({})
    ServerMessageModel.exec()
    .then((serverMessage) => { fulfill(serverMessage) })
    .catch((error) => { reject(error) })
  })
}

module.exports = ServerModeCtrl
