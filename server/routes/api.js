const express = require('express')

const router = express.Router()
const Rpc = require('../lib/rpc')
const TransactionCtrl = require('../lib/db/transaction.ctrl')
const ChangellyCtrl = require('../lib/changelly/changelly.ctrl')

router.get('/', (req, res) => res.send('api works'))
router.get('/rpc/getinfo', Rpc.getInfo)
router.get('/db/transaction/:id', TransactionCtrl.getTransaction)
router.get('/db/transaction', TransactionCtrl.getTransaction)
router.post('/db/transaction', TransactionCtrl.createTransaction)

router.get('/changelly/getCurrencies', ChangellyCtrl.getCurrencies)
router.get('/changelly/getMinAmount/:from/:to', ChangellyCtrl.getMinAmount)
router.get('/changelly/getExchangeAmount/:from/:to/:amount', ChangellyCtrl.getExchangeAmount)

router.all('/*', (req, res) => {
  res.status(404).json({ error: ' - API Endpoint ' + req.url + ' does not exist' })
})

module.exports = router
