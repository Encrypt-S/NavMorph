const lodash = require('lodash')
const Logger = require('../logger')

// Compile model from schema
const ServerModeModel = require('./serverMode.model')

const ServerModeCtrl = {}

ServerModeCtrl.checkMode = () => {
  return new Promise((fulfill, reject) => {
    ServerModeModel.find({})
    .select('server_mode')
    .exec()
    .then((mode_status) => { fulfill(mode_status) })
    .catch((error) => { reject(error) })
  })
}

module.exports = ServerModeCtrl
