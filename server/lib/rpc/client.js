const Client = require('bitcoin-core')
const configData = require('../../../server-settings.json')


let Rpc = { //eslint-disable-line
  navClient: new Client(configData.navClient),
  internal: {}
}

module.exports = Rpc
