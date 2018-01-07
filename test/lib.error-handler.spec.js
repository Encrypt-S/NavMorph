'use strict'

const expect = require('expect')
const rewire = require('rewire')
const sinon = require('sinon')

let ErrorHandler = rewire('../server/lib/error-handler')
let Validator = rewire('../server/lib/options-validator') // eslint-disable-line

describe('[ErrorHandler]', () => {
  describe('(handleError)', () => {
    beforeEach(() => { // reset the rewired functions
      ErrorHandler = rewire('../server/lib/error-handler')
      Validator = rewire('../server/lib/options-validator')
      console.log(Object.keys(ErrorHandler))
    })
    it('should catch rejected params', (done) => {

      const statusMessage = 'USELESS'
      const err = 'ERROR'
      const code = 'CODE'
      const sendEmail = 'SENDMAIL'
      const res = 'RES'

      const mockStartValidation = (params, options) => {
        expect(params.statusMessage).toBe(statusMessage)
        expect(params.err).toBe(err)
        expect(params.code).toBe(code)
        expect(params.sendEmail).toBe(sendEmail)
        expect(params.res).toBe(res)
        return Promise.reject(err)
      }

      const mockLogger = {
        writeLog: (code, statusMessage, error, sendMail) => {
          expect(statusMessage).toBe('Incorrect Params - couldn\'t handle error')
          expect(err.error).toBe(err)
          expect(err.originalError).toBe(params)
          expect(code).toBe('ERR_HDL_001')
          expect(sendEmail).toBe(sendEmail)

          done()
        }
      }

      ErrorHandler.__set__('Validator.startValidation', mockStartValidation)

      ErrorHandler.handleError(statusMessage, err, code, sendEmail, res)
    })

    // it('should pass on params', (done) => {
    //   const req = {
    //     params: {
    //       generateEstimateOptions: {},
    //       from: 'NAV',
    //       to: 'BTC',
    //     },
    //   }
    //
    //   const mockApiOptions = { junkOption: {} }
    //   ErrorHandler.__set__('ApiOptions', mockApiOptions)
    //
    //   const mockStartValidation = (params, options) => {
    //     expect(params).toBe(req.params)
    //     expect(options).toBe(mockApiOptions.generateEstimateOptions)
    //     return Promise.resolve()
    //   }
    //   ErrorHandler.__set__('Validator.startValidation', mockStartValidation)
    //
    //   const mockEta = [1, 1]
    //
    //   ErrorHandler.getEta = (options) => {
    //     expect(options.status).toBe('ESTIMATE')
    //     expect(options.timeSent).toBeA('object')
    //     expect(options.to).toBe(req.params.to)
    //     expect(options.from).toBe(req.params.from)
    //     return Promise.resolve(mockEta)
    //   }
    //
    //   const junkRes = {
    //     send: (data) => {
    //       expect(data).toBe(mockEta)
    //       done()
    //     },
    //   }
    //
    //   ErrorHandler.generateEstimate(req, junkRes)
    // })
  })
})
