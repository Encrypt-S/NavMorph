const Validator = require('validator')
const lodash = require('lodash')

const OptionsValidator = { }

OptionsValidator.startValidatation = (params, options) => {

  let errors = []
  return new Promise((fulfill, reject) => { 
    if (lodash.intersection(Object.keys(params), Object.keys(options)).length !== Object.keys(options).length) {
      reject(new Error('PARAMS_ERROR', 'Failed to receive params', params, options))
      return
    }
    try {
      for(key of Object.keys(params)){
        OptionsValidator.validateParams(params[key], options[key], errors)
      }
    } catch (exception) {
      errors.push(exception)
    }

    if (errors.length > 0) {
      reject(errors)
      return
    } 

    fulfill()
  })
}

OptionsValidator.validateParams = (param, validators, errors) => {
  validators.forEach((validator) => {
    switch(validator.validator) {
      case 'isString':
        OptionsValidator.isString(param, validator, errors)
        break
      case 'isNumber':
        OptionsValidator.isNumber(param, validator, errors)
        break
      default:
        break
    }
  })
}

OptionsValidator.isString = (param, validator, errors) => {
  if(!(typeof param === 'string')) {
    errors.push({ err: 'STR_NON_STRING', param, validator })
    return
  }

  if(!Validator.isAlphanumeric(param)) {
    errors.push({ err: 'STR_NON_ALPHANUM', param, validator })
  }

  if(validator.maxLength && validator.maxLength < param.length) {
    errors.push({ err: 'STR_MAX_LENGTH', param, validator })
  }  
  if(validator.minLength && validator.minLength > param.length) {
    errors.push({ err: 'STR_MIN_LENGTH', param, validator })
  }
  return 
}

OptionsValidator.isNumber = (param, validator, errors) => {
  if(!Validator.isNumeric(param) && !Validator.isDecimal(param)) {
    errors.push({ err: 'NUM_NON_NUMBER', param, validator })
    return 
  }
}

module.exports = OptionsValidator
