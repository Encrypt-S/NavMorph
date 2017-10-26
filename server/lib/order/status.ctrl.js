const TransactionCtrl = require('../db/transaction.ctrl')
const EtaCtrl = require('./eta.ctrl')
const LoginCtrl = require('../db/login.ctrl')
const Validator = require('../options-validator')
const ConfigData = require('../../config')
const ApiOptions = require('../../api-options.json')

const Logger = require('../logger')

const OrderStatusCtrl = {}

OrderStatusCtrl.getOrder = (req, res) => {
  const params = req.params
  OrderStatusCtrl.validateParams(params, ApiOptions.getOrderStatusOptions)
  .then(() => {
    LoginCtrl.checkIpBlocked(params.ipAddress)
    .then((isBlocked) => {
      if (isBlocked) {
        LoginCtrl.insertAttempt(params.ipAddress, params.polymorphId)
        .then(OrderStatusCtrl.sendBlockedResponse(res))
        .catch(error => OrderStatusCtrl.handleError(error, res, '002'))
      } else {
        OrderStatusCtrl.checkOrderExists(params, res)
      }
    })
  })
  .catch((error) => { OrderStatusCtrl.handleError(error, res, '001') })
}


OrderStatusCtrl.checkOrderExists = (params, res) => {
  TransactionCtrl.checkIfIdExists(params.orderId)
  .then((orderExists) => {
    if (orderExists) {
      OrderStatusCtrl.getOrderFromDb(params, res)
    } else {
      res.send([[], []])
    }
  })
  .catch((error) => {
    OrderStatusCtrl.handleError(error, res, '003')
  })
}

OrderStatusCtrl.getOrderFromDb = (params, res) => {
  TransactionCtrl.getOrder(params.orderId, params.orderPassword)
  .then((orderArr) => {
    const order = orderArr[0]
    if (!order) {
      OrderStatusCtrl.checkForSuspiciousActivity(params, res)
    } else if (order.order_status === 'ABANDONED') {
      OrderStatusCtrl.sendEmptyResponse(res)
    } else {
      EtaCtrl.getEta({ status: order.order_status, timeSent: order.sent, from: order.input_currency, to: order.output_currency })
      .then((eta) => {
        res.send([order, eta])
      })
      .catch(error => OrderStatusCtrl.handleError(error, res, '010'))
    }
  })
  .catch(error => OrderStatusCtrl.handleError(error, res, '011'))
}

OrderStatusCtrl.checkForSuspiciousActivity = (params, res) => {
  LoginCtrl.insertAttempt(params.ipAddress, params.orderId)
  .then(LoginCtrl.checkIfSuspicious(params.ipAddress)
    .then((isSuspicious) => {
      if (isSuspicious) {
        LoginCtrl.blackListIp({ ipAddress: params.ipAddress })
        .then(OrderStatusCtrl.sendBlockedResponse(res))
        .catch(error => OrderStatusCtrl.handleError(error, res, '004'))
      } else {
        OrderStatusCtrl.sendEmptyResponse(res)
      }
    })
    .catch(error => OrderStatusCtrl.handleError(error, res, '005'))
  )
  .catch(error => OrderStatusCtrl.handleError(error, res, '006'))
}

OrderStatusCtrl.sendEmptyResponse = (res) => {
  res.send([])
}

OrderStatusCtrl.sendBlockedResponse = (res) => {
  res.send(['BLOCKED'])
}


OrderStatusCtrl.updateOrderStatus = (req, res) => {
  OrderStatusCtrl.validateParams(req.params, ApiOptions.updateOrderStatusOptions)
  .then(() => {
    const params = req.params
    const newStatus = req.params.status
    if (ConfigData.validOrderStatuses.indexOf(newStatus) === -1) {
      OrderStatusCtrl.handleError(new Error('Invalid order status'), res, '007')
    }
    TransactionCtrl.updateOrderStatus(params.orderId, params.orderPassword, params.newStatus)
  })
  .then((order) => { res.send(order) })
  .catch((error) => { OrderStatusCtrl.handleError(error, res, '008') })
}

OrderStatusCtrl.abandonOrder = (req, res) => {
  OrderStatusCtrl.validateParams(req.params, ApiOptions.updateOrderStatusOptions)
  .then(() => {
    const polymorphId = req.params.orderId
    const orderPassword = req.params.orderPassword
    TransactionCtrl.updateOrderStatus(polymorphId, orderPassword, 'ABANDONED')
  })
  .then(() => { res.send({ status: 'SUCCESS' }) })
  .catch((error) => { OrderStatusCtrl.handleError(error, res, '009') })
}

OrderStatusCtrl.handleError = (err, res, code) => {
  const statusMessage = 'Unable to fetch/update Polymorph Order'
  res.send(JSON.stringify({
    statusCode: 200,
    type: 'FAIL',
    code: 'ORDER_STATUS_CTRL_' + code || '000',
    statusMessage,
    err,
  }))
  Logger.writeLog(code, statusMessage, { error: err }, true)
}

OrderStatusCtrl.validateParams = (params, options) => {
  return new Promise((fulfill, reject) => {
    Validator.startValidatation(params, options)
    .then(() => fulfill())
    .catch((errorArr => reject(errorArr)))
  })
}

module.exports = OrderStatusCtrl
