const Validator from 'validator'

const OptionsValidator = { }

OptionsValidator.validateParams = (params, options) => {
  return new Promise((fulfill, reject) => { 
    if (lodash.intersection(Object.keys(params), Object.keys(options)).length !== Object.keys(options)) {
      reject(new Error('PARAMS_ERROR', 'Failed to receive params', params, options))
      return
    }



}

OptionsValidator.checkString = (str) => {
  return Validator.isAlphanumeric(str)
}

OptionsValidator.checkNumber = (str) => {
  return (Validator.isNumeric(str) || !Validator.isDecimal(str))
}

OptionsValidator.checkSanitizeString = (str) => {
  
  return cleanStr
}

module.exports = OptionsValidator
