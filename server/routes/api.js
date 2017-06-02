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

router.get('/changelly/currenciess', (req, res) => Changelly.getCurrencies((err, data) => {
  if (err) {
    console.log('Error: ', err)
  } else {
    res.send(data)
  }
}))

router.all('/*', (req, res) => {
  res.status(404).json({error:' - API Endpoint ' + req.url + ' does not exist'})
})

module.exports = router
