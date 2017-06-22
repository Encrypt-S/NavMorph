const Client = require('bitcoin-core')
const configData = require('../../config')


let Rpc = { //eslint-disable-line
  navClient: new Client(configData.navClient),
}

module.exports = Rpc
