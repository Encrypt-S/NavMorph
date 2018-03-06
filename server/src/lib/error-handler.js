let Logger = require('./logger') // eslint-disable-line prefer-const
let Validator = require('./options-validator') // eslint-disable-line prefer-const
const ApiOptions = require('../api-options.json')

const ErrorHandler = {}

ErrorHandler.handleError = (params) => {
  Validator.startValidation(params, ApiOptions)
  .then(() => {
    params.res.send(JSON.stringify({
      statusCode: 200,
      type: 'FAIL',
      statusMessage: params.statusMessage,
      err: params.err,
    }))
    Logger.writeErrorLog(params.code, params.statusMessage, { error: params.err }, params.sendEmail)
  })
  .catch((errorArr) => {
    Logger.writeErrorLog('ERR_HDL_001', 'Incorrect Params - couldn\'t handle error', { error: errorArr, originalError: params }, true)
  })
}

module.exports = ErrorHandler
