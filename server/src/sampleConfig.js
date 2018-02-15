// actual config file is named config.js

const configData = {

  version: '0.0.1',
  navClient: {
    username: 'user',
      password: 'password',
      port: 44444,
      host: '127.0.0.1',
  },

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
  walletKey: '',
  
  mailSettings: {
      smtp: {
          user: ' @ .com',
          pass: ' ',
          server: 'smtp.gmail.com',
        },
      clientId: ' ',
      clientSecret: ' ',
      refreshToken: ' ',
      notificationEmail: ' @ .com',
      authCode: ' ',
  },

  validOrderStatuses: ['created', 'abandoned', 'completed']
}

module.exports = configData
