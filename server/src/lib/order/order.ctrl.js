const uuid = require('uuid/v4')

const client = require('../rpc/client')
const ChangellyCtrl = require('../changelly/changelly.ctrl')
const TransactionCtrl = require('../db/transaction.ctrl')
const ServerModeCtrl = require('../db/serverMode.ctrl')
const Validator = require('../options-validator')
const ApiOptions = require('../../api-options.json')
let ErrorHandler = require('../error-handler')

const OrderCtrl = {}

OrderCtrl.createOrderRoute = async (req, res) => {
  try {
    await Validator.startValidation(req.params, ApiOptions.orderOptions)
    await ServerModeCtrl.checkMode()
    req.params.navAddress = await client.nav.getNewAddress()
    req.params.changellyAddressOne = await OrderCtrl.getFirstChangellyAddress(req)
    req.params.changellyAddressTwo = await OrderCtrl.getSecondChangellyAddress(req)
    req.params.polymorphId = uuid()
    await TransactionCtrl.createTransaction(req, res)

    res.json({ data: { id: req.params.polymorphId } })
  } catch (error) {
    ErrorHandler.handleError({
      statusMessage: 'Unable to create NavMorph Order',
      err: error,
      code: 'ORDER_CTRL_001',
      sendEmail: true,
      res
    })
  }
}


OrderCtrl.getFirstChangellyAddress = async (req, res) => {
  if (req.params.from === 'NAV') {
    return req.params.navAddress
  } else {
    const newAddress = await OrderCtrl.getChangellyAddress(req.params.from, 'NAV', req.params.navAddress)
    return newAddress
  }
}

OrderCtrl.getSecondChangellyAddress = async (req, res) => {
  if (req.params.to === 'NAV') {
    return req.params.address
  } else {
    const newAddress = await OrderCtrl.getChangellyAddress('NAV', req.params.to, req.params.address)
    return newAddress
}
}

OrderCtrl.getChangellyAddress = (inputCurrency, outputCurrency, destAddress) => {
  return new Promise((fulfill, reject) => {
    if (outputCurrency === 'NAV') {
      fulfill(destAddress)
    }
    ChangellyCtrl.generateAddress({
      from: inputCurrency.toLowerCase(),
      to: outputCurrency.toLowerCase(),
      address: destAddress,
      extraId: null,
    })
    .then((data) => {
      fulfill(data.result.address)
    })
    .catch((error) => { reject(error) })
  })
}

module.exports = OrderCtrl
