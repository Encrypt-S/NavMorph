"use strict";

const express = require('express')

const router = express.Router()
const rpcGetInfo = require('../lib/rpc/get-info')
const rpcGetNewAddress = require('../lib/rpc/get-new-address')
const TransactionCtrl = require('../lib/db/transaction.ctrl')
const ChangellyCtrl = require('../lib/changelly/changelly.ctrl')
const OrderCtrl = require('../lib/order/order.ctrl')
const EtaCtrl = require('../lib/order/eta.ctrl')
const OrderStatusCtrl = require('../lib/order/status.ctrl')

router.get('/', (req, res) => res.send('api works'))
router.get('/rpc/getinfo', rpcGetInfo.getInfo)
router.get('/rpc/getnewaddress', rpcGetNewAddress.getNewAddress)
router.get('/db/transaction/:id', TransactionCtrl.getTransaction)
router.get('/db/transaction', TransactionCtrl.getTransaction)
router.post('/db/transaction', TransactionCtrl.createTransaction)

router.get('/changelly/getCurrencies', ChangellyCtrl.getCurrencies)
router.get('/changelly/getMinAmount/:from/:to', ChangellyCtrl.getMinAmount)
router.get('/changelly/getExchangeAmount/:from/:to/:amount', ChangellyCtrl.getExchangeAmount)

router.get('/changelly/generateAddress/:from/:to/:address/:extraId', ChangellyCtrl.generateAddress)

router.get('/changelly/getEta/:from/:to/', EtaCtrl.generateEstimate)

router.get('/order/createOrder/:from/:to/:address/:amount/:extraId', OrderCtrl.createOrder)
router.get('/order/getOrder/:orderId/:orderPassword', OrderStatusCtrl.getOrder)
router.get('/order/updateOrderStatus/:orderId/:orderPassword/:status', OrderStatusCtrl.updateOrderStatus)
router.get('/order/abandonOrder/:orderId/:orderPassword', OrderStatusCtrl.abandonOrder)

router.all('/*', (req, res) => {
  res.status(404).json({ error: ' - API Endpoint ' + req.url + ' does not exist' })
})

module.exports = router
