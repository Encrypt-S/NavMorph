const lodash = require('lodash')

// Compile model from schema
const TransactionModel = require('./transaction.model')

const TransactionCtrl = {}

TransactionCtrl.handleError = (err, res, code, message) => {
  res.send(JSON.stringify({
    status: 200,
    type: 'FAIL',
    code,
    message,
    error: err,
  }))
}

TransactionCtrl.createTransaction = (req, res) => {
  const required = ['output_currency', 'output_address', 'changelly_address',
    'changelly_id', 'polymorph_id', 'polymorph_pass',
    'changelly_address_one', 'nav_address_one']
  if (!req.body || lodash.intersection(Object.keys(req.body), required).length !== required.length) {
    TransactionCtrl.handleError('params_error', res, 'TC_001', 'Failed to receive params')
    return
  }

  TransactionCtrl.runtime = { res, req }

  TransactionCtrl.runtime.transaction = new TransactionModel({
    changelly_id: req.body.changelly_id,
    polymorph_id: req.body.polymorph_id,
    polymorph_pass: req.body.polymorph_pass,
    changelly_address_one: req.body.changelly_address_one,
    // changelly_address_two: req.body.changelly_address_two,
    nav_address_one: req.body.nav_address_one,
    // nav_address_two: req.body.nav_address_two,
    source_currency: req.body.source_currency,
    output_currency: req.body.output_currency,
    output_address: req.body.output_address,
    changelly_address: req.body.changelly_address,
    order_status: 'created',
    delay: req.body.delay || 0,
    created: new Date(),
  })

  TransactionCtrl.runtime.transaction.save(TransactionCtrl.savedTransaction)
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
