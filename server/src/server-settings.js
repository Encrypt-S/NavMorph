const secrets = require('./secrets')

module.exports = {
  app: {
    static: 'dist',
    apiUri: '/api',
    catchAllUri: 'dist/index.html',
  },

  serverPort: '8080',

  sslCert: {
    days: 1,
    selfSigned: true,
  },

  // Update to "mongodb://mongo/polymorph" for docker environment
  mongoDBUrl: 'mongodb://127.0.0.1/polymorph',

  version: '0.0.2',
  navClient: {
    username: secrets.navClient.username,
    password: secrets.navClient.password,
    walletPassphrase: secrets.navClient.walletPassphrase,
    walletUnlockTime: 600, // In seconds
    port: 44445,
    host: '127.0.0.1',
  },
  changellyApiEndPoints: {
    getCurrencies: 'getCurrencies',
    getMinAmount: 'getMinAmount',
    getExchangeAmount: 'getExchangeAmount',
    generateAddress: 'generateAddress',
    getTransaction: 'getTransactions',
    getExchangeStatus: 'getStatus',
  },
  changellyUrl: 'https://api.changelly.com',
  changellyKey: secrets.changelly.changellyKey,
  changellySecretKey: secrets.changelly.changellySecretKey,
  mailSettings: {
    smtp: {
      user: secrets.mailSettings.user,
      pass: secrets.mailSettings.pass,
      server: 'smtp.gmail.com',
    },
    clientId: secrets.clientId,
    clientSecret: secrets.clientSecret,
    refreshToken: secrets.refreshToken,
    notificationEmail: secrets.notificationEmail,
    authCode: secrets.authCode,
  },
  validOrderStatuses: [
    'ESTIMATE',
    'COMPLETED',
    'ABANDONED',
    'EXPIRED',
    'CREATED',
    'CONFIRMING',
    'EXCHANGING',
    'FINISHED',
    'FAILED',
  ],

  timeConsts: {
    changelly: [5, 30],
    navTech: [5, 10],
  },
  basicAuth: {
    name: secrets.basicAuth.name,
    pass: secrets.basicAuth.pass,
  },

  processHandler: {
    timerLength: 120000,
  },
  preflightCheckController: {
    maxBlockHeightDiscrepency: 5,
  },
}
