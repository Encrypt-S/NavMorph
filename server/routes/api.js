const express = require('express')

const router = express.Router()
const rpcGetInfo = require('../lib/rpc/get-info')
const rpcGetNewAddress = require('../lib/rpc/get-new-address')
const TransactionCtrl = require('../lib/db/transaction.ctrl')
const ChangellyCtrl = require('../lib/changelly/changelly.ctrl')
const OrderCtrl = require('../lib/order/order.ctrl')

router.get('/', (req, res) => res.send('api works'))
router.get('/rpc/getinfo', rpcGetInfo.getInfo)
router.get('/rpc/getnewaddress', rpcGetNewAddress.getNewAddress)
router.get('/db/transaction/:id', TransactionCtrl.getTransaction)
router.get('/db/transaction', TransactionCtrl.getTransaction)
router.post('/db/transaction', TransactionCtrl.createTransaction)

router.get('/changelly/getCurrencies', ChangellyCtrl.getCurrencies)
router.get('/changelly/getMinAmount/:from/:to', ChangellyCtrl.getMinAmount)
router.get('/changelly/getExchangeAmount/:from/:to/:amount', ChangellyCtrl.getExchangeAmount)
router.get('/changelly/getExchangeAmount/:from/:to/:amount', ChangellyCtrl.getExchangeAmount)
router.get('/order/createOrder/:from/:to/:address/:extraId', OrderCtrl.createOrder)
router.get('/order/getOrder/orderId:/orderPassword:', OrderCtrl.getOrder)
router.get('/order/getOrderStatus/orderId:/orderPassword:', OrderCtrl.getOrderStatus)
router.get('/order/abandonOrder/orderId:/orderPassword:', OrderCtrl.abandonOrder)

router.all('/*', (req, res) => {
  res.status(404).json({ error: ' - API Endpoint ' + req.url + ' does not exist' })
})

module.exports = router
