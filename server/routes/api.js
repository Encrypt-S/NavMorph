const express = require('express')

const router = express.Router()
const Rpc = require('../lib/rpc')
const TransactionCtrl = require('../lib/db/transaction.ctrl')
const Changelly = require('../lib/changelly/changelly')

router.get('/', (req, res) => res.send('api works'))
router.get('/rpc/getinfo', Rpc.getInfo)
router.get('/db/transaction/:id', TransactionCtrl.getTransaction)
router.get('/db/transaction', TransactionCtrl.getTransaction)
router.post('/db/transaction', TransactionCtrl.createTransaction)

router.get('/changelly/coins', (req, res) => res.send(Changelly.getCurrencies()))

module.exports = router
