const transactionCtrl = require('../db/transaction.ctrl')
const etaCtrl = require('./eta.ctrl')
const loginCtrl = require('../db/login.ctrl')
const validator = require('../options-validator')
const configData = require('../../server-settings')
const apiOptions = require('../../api-options.json')
let errorHandler = require('../error-handler') // eslint-disable-line prefer-const


const OrderStatusCtrl = {}

OrderStatusCtrl.getOrder = async (req, res) => {
  try {
    const params = req.params
    params.ipAddress = req.ip
    await validator.startValidation(params, apiOptions.getOrderStatusOptions)
    const isBlocked = await loginCtrl.checkIpBlocked({ ipAddress: params.ipAddress })

    if (isBlocked) {
      await loginCtrl.insertAttempt(params.ipAddress, params.polymorphId)
      return res.status(401).json({errors: [{ code: 'GET_ORDER_UNAUTHORIZED', message: 'Unauthorised Access' }]})
    }

    const orderAndEta = await OrderStatusCtrl.getOrderFromDb(params, res)
    return res.json({ data: orderAndEta })
  } catch (err) {
    errorHandler.handleError({
      statusMessage: 'Unable to fetch/update NavMorph Order',
      code: 'ORDER_STATUS_CTRL_001',
      err: err,
      sendEmail: true,
      res
    })
    return res.status(500).json({errors: [{ code: 'GET_ORDER_FAILED', message: 'Failed to get order' }]})
  }
}

OrderStatusCtrl.getOrderFromDb = async (params, res) => {
  try {
    const order = await transactionCtrl.getOrder(params.orderId)
    if (!order) {
      return OrderStatusCtrl.checkForSuspiciousActivity(params, res)
    } else if (order.order_status === 'ABANDONED') {
      return {status: 'ABANDONED'}
    } else {
      const eta = await etaCtrl.getEta({ status: order.order_status, timeSent: order.sent, from: order.input_currency, to: order.output_currency })
      return {order, eta}
    }
  } catch (err) {
    errorHandler.handleError({
      statusMessage: 'Unable to fetch/update NavMorph Order',
      code: 'ORDER_STATUS_CTRL_006',
      err: err,
      sendEmail: true,
      res
    })
  }
}

OrderStatusCtrl.checkForSuspiciousActivity = async (params, res) => {
  try {
    await loginCtrl.insertAttempt(params.ipAddress, params.orderId)
    const isSuspicious = await loginCtrl.checkIfSuspicious(params.ipAddress)
    if (isSuspicious) {
      await loginCtrl.blackListIp({ ipAddress: params.ipAddress })
    }
    return {}
  } catch (err) {
    errorHandler.handleError({
      statusMessage: 'Unable to fetch/update Polymorph Order',
      code: 'ORDER_STATUS_CTRL_004',
      err,
      sendEmail: true,
      res
    })
  }
}

OrderStatusCtrl.updateOrderStatus = async (req, res) => {
  try {
    await validator.startValidation(req.params, apiOptions.updateOrderStatusOptions)
    const params = req.params
    const newStatus = req.params.status
    if (configData.validOrderStatuses.indexOf(newStatus) === -1) {
      errorHandler.handleError({
        statusMessage: 'Unable to fetch/update Polymorph Order',
        code: 'ORDER_STATUS_CTRL_005',
        err: new Error('Invalid order status'),
        sendEmail: true,
        res
      })
    }
    const order = await transactionCtrl.updateOrderStatus(params.orderId, params.newStatus)
    return res.send(order)
  } catch(err) {
    errorHandler.handleError({
      statusMessage: 'Unable to fetch/update Polymorph Order',
      code: 'ORDER_STATUS_CTRL_011',
      err: err,
      sendEmail: true,
      res
    })
  }
}

OrderStatusCtrl.abandonOrder = async (req, res) => {
  try {
    await validator.startValidation(req.params, apiOptions.updateOrderStatusOptions)
    await transactionCtrl.updateOrderStatus(req.params.orderId, 'ABANDONED')
    return res.send({ status: 'SUCCESS' })
  } catch(err) {
    errorHandler.handleError({
      statusMessage: 'Unable to fetch/update Polymorph Order',
      code: 'ORDER_STATUS_CTRL_012',
      err: err,
      sendEmail: true,
      res
    })
  }
}
OrderStatusCtrl.validateParams = async (params, options) => {

  return new Promise((fulfill, reject) => {
    validator.startValidation(params, options)
    .then(() => fulfill())
    .catch((errorArr => reject(errorArr)))
  })
}

module.exports = OrderStatusCtrl
