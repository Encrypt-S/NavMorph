"use strict";

const express = require('express')

const router = express.Router()
const TransactionCtrl = require('../lib/db/transaction.ctrl')
const ChangellyCtrl = require('../lib/changelly/changelly.ctrl')
const OrderCtrl = require('../lib/order/order.ctrl')
const EtaCtrl = require('../lib/order/eta.ctrl')
const OrderStatusCtrl = require('../lib/order/status.ctrl')

router.get('/', (req, res) => res.send('api works'))
router.get('/db/transaction/:id', TransactionCtrl.getTransaction)
router.get('/db/transaction', TransactionCtrl.getTransaction)

router.get('/changelly/getCurrencies', ChangellyCtrl.getCurrencies)
router.get('/changelly/getMinAmount/:from/:to', ChangellyCtrl.getMinAmount)
router.get('/changelly/getExchangeAmount/:from/:to/:amount', ChangellyCtrl.getExchangeAmount)

router.get('/changelly/generateAddress/:from/:to/:address', ChangellyCtrl.generateAddress)

router.get('/changelly/getEta/:from/:to/', EtaCtrl.generateEstimate)

router.get('/order/createOrder/:from/:to/:address/:amount', OrderCtrl.createOrder)
router.get('/order/getOrder/:orderId', OrderStatusCtrl.getOrder)
router.get('/order/updateOrderStatus/:orderId/:status', OrderStatusCtrl.updateOrderStatus)
router.get('/order/abandonOrder/:orderId', OrderStatusCtrl.abandonOrder)

router.all('/*', (req, res) => {
  res.status(404).json({ error: ' - API Endpoint ' + req.url + ' does not exist' })
})

module.exports = router
