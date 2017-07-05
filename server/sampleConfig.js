// actual config file is named config.js
const configData = {
  version: '0.0.1',

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
  mailSettings: {
    smtp: {
      user: '__@__.com',
      pass: 'password',
      server: 'smtp.gmail.com',
    },
    notificationEmail: '__@__.com',
  },
}

module.exports = configData
