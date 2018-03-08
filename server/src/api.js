'use strict'

const express = require('express')

const router = express.Router([])
const TransactionCtrl = require('./lib/db/transaction.ctrl')
const ChangellyCtrl = require('./lib/changelly/changelly.ctrl')
const OrderCtrl = require('./lib/order/order.ctrl')
const EtaCtrl = require('./lib/order/eta.ctrl')
const OrderStatusCtrl = require('./lib/order/status.ctrl')

// TODO: Matt -- What are theses? Do they actually doing anything?
router.get('/db/transaction/:id', TransactionCtrl.getTransaction)
router.get('/db/transaction', TransactionCtrl.getTransaction)

router.get('/changelly/getCurrencies', ChangellyCtrl.getCurrenciesRoute)
router.get('/changelly/getMinAmount/:from/:to', ChangellyCtrl.getMinAmountRoute)
router.get('/changelly/getExchangeAmount/:from/:to/:amount', ChangellyCtrl.getExchangeAmountRoute)
router.get('/changelly/getEta/:from/:to/', EtaCtrl.generateEstimateRoute)

router.get('/order/createOrder/:from/:to/:address/:amount', OrderCtrl.createOrderRoute)
router.get('/order/getOrder/:orderId', OrderStatusCtrl.getOrderRoute)
router.get('/order/updateOrderStatus/:orderId/:status', OrderStatusCtrl.updateOrderStatusRoute)
router.get('/order/abandonOrder/:orderId', OrderStatusCtrl.abandonOrderStatusRoute)

router.all('/*', (req, res) => {
  res.status(404).json({ error: ' - API Endpoint ' + req.url + ' does not exist' })
})

module.exports = router
