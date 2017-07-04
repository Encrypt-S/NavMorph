// actual config file is named config.js
const configData = {

  changellyApiEndPoints: {
    getCurrencies: 'getCurrencies',
    getMinExchange: 'getMinAmount',
    getEstimatedExchange: 'getExchangeAmount',
    getGenerateAddress: 'generateAddress',
    getTransaction: 'getTransactions',
    getExchangeStatus: 'getStatus',
  },
  changellyUrl: 'https://api.changelly.com',
  changellyKey: '32 char long',
  changellySecretKey: '64 char long',
  navClient: {
    username: 'user',
    password: 'password',
    port: 44444,
    host: '127.0.0.1',
  },
}

module.exports = configData
