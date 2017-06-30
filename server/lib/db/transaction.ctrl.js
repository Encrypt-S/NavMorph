const lodash = require('lodash')

// Compile model from schema
const TransactionModel = require('./transaction.model')

const TransactionCtrl = { internal: {} }

TransactionCtrl.handleError = (err, res, code, message) => {
  res.send(JSON.stringify({
    status: 200,
    type: 'FAIL',
    code,
    message,
    error: err,
  }))
}

TransactionCtrl.internal.createTransaction = (req, res) => {
  const required = ['from', 'to', 'address', 'amount', 'extraId', 'changellyId',
    'polymorphId', 'polymorphPass', 'changellyAddressOne', 'navAddressOne']
  if (!req || lodash.intersection(Object.keys(req.params), required).length !== required.length) {
    return new Error('params_error', 'TC_001', 'Failed to receive params')
  }

  TransactionCtrl.runtime = { req, res }

  TransactionCtrl.runtime.transaction = new TransactionModel({
    changelly_id: req.params.changellyId,
    polymorph_id: req.params.polymorphId,
    polymorph_pass: req.params.polymorphPass,
    changelly_address_one: req.params.changellyAddressOne,
    // changelly_address_two: req.params.changelly_address_two,
    nav_address_one: req.params.navAddressOne,
    // nav_address_two: req.params.nav_address_two,
    input_currency: req.params.from,
    output_currency: req.params.to,
    output_address: req.params.address,
    order_status: 'created',
    delay: req.params.delay || 0,
    created: new Date(),
  })
  return TransactionCtrl.runtime.transaction.save(TransactionCtrl.internal.savedTransaction)
}

TransactionCtrl.createTransaction = (req, res) => {
  const required = ['from', 'to', 'address', 'amount', 'extraId', 'changellyId',
    'polymorphId', 'polymorphPass', 'changellyAddressOne', 'navAddressOne']
  if (!req.body || lodash.intersection(Object.keys(req.body), required).length !== required.length) {
    TransactionCtrl.handleError('params_error', res, 'TC_001', 'Failed to receive params')
    return
  }

  TransactionCtrl.runtime = { res, req }

  TransactionCtrl.runtime.transaction = new TransactionModel({
    changelly_id: req.body.changelly_id,
    polymorph_id: req.body.polymorph_id,
    polymorph_pass: req.body.polymorph_pass,
    changelly_address_one: req.body.changellyAddressOne,
    // changelly_address_two: req.body.changelly_address_two,
    nav_address_one: req.body.navAddressOne,
    // nav_address_two: req.body.nav_address_two,
    input_currency: req.body.source_currency,
    output_currency: req.body.output_currency,
    output_address: req.body.output_address,
    order_status: 'created',
    delay: req.body.delay || 0,
    created: new Date(),
  })
  try {
    TransactionCtrl.runtime.transaction.save(TransactionCtrl.savedTransaction)
  } catch (e) {
    throw e
  }
}

TransactionCtrl.internal.savedTransaction = (err) => {
  if (err) {
    console.log(err)
    return new Error('Failed to save transaction')
  }
  return false
}

TransactionCtrl.savedTransaction = (err) => {
  if (err) {
    TransactionCtrl.handleError(err, TransactionCtrl.runtime.res, 'TC_002', 'Failed to save transaction')
    return
  }
  TransactionCtrl.runtime.res.send(JSON.stringify({
    status: 200,
    type: 'SUCCESS',
    data: TransactionCtrl.runtime.transaction,
  }))
}

TransactionCtrl.getTransaction = (req, res) => {
  TransactionCtrl.runtime = { res, req }
  const query = TransactionModel.find()
  if (req.params && req.params.id) {
    query.where('_id').equals(req.params.id)
  }
  query.exec(TransactionCtrl.gotTransaction)
}

TransactionCtrl.gotTransaction = (err, transactions) => {
  if (err) {
    TransactionCtrl.handleError(err, TransactionCtrl.runtime.res, 'TC_003', 'Failed to get transaction')
    return
  }
  TransactionCtrl.runtime.res.send(JSON.stringify({
    status: 200,
    type: 'SUCCESS',
    data: transactions,
  }))
}

module.exports = TransactionCtrl
