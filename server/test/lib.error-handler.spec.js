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
    })
    it('should catch rejected params', (done) => {
      const mockStatusMessage = 'MOCK_STATUS'
      const mockErr = 'ERROR'
      const mockCode = 'CODE'
      const mockSendEmail = true
      const mockRes = 'RES'
      let mockParams = {}

      const mockStartValidation = (params, options) => {
        expect(params.statusMessage).toBe(mockStatusMessage)
        expect(params.err).toBe(mockErr)
        expect(params.code).toBe(mockCode)
        expect(params.sendEmail).toBe(mockSendEmail)
        expect(params.res).toBe(mockRes)
        mockParams = params
        return Promise.reject(mockErr)
      }

      const mockLogger = {
        writeLog: (errCode, statusMessage, error, sendEmail) => {
          expect(statusMessage).toBe('Incorrect Params - couldn\'t handle error')
          expect(error.error).toBe(mockErr)
          expect(error.originalError).toBe(mockParams)
          expect(errCode).toBe('ERR_HDL_001')
          expect(sendEmail).toBe(mockSendEmail)

          done()
        }
      }

      ErrorHandler.__set__('Validator.startValidation', mockStartValidation)

      ErrorHandler.__set__('Logger', mockLogger)

      ErrorHandler.handleError({
        statusMessage: mockStatusMessage,
        err: mockErr,
        code: mockCode,
        sendEmail: mockSendEmail,
        res: mockRes,
      })
    })

    it('should pass on params', (done) => {
      const mockStatusMessage = 'ANOTHER_MOCK_STATUS'
      const mockErr = 'ERROR'
      const mockCode = 'CODE'
      const mockSendEmail = true
      const mockRes = {
        send: sinon.spy()
      }

      const mockStartValidation = (params, options) => {
        expect(params.statusMessage).toBe(mockStatusMessage)
        expect(params.err).toBe(mockErr)
        expect(params.code).toBe(mockCode)
        expect(params.sendEmail).toBe(mockSendEmail)
        expect(params.res).toBe(mockRes)
        return Promise.resolve()
      }

      const mockLogger = {
        writeLog: (errCode, statusMessage, error, sendEmail) => {
          expect(statusMessage).toBe(mockStatusMessage)
          expect(error.error).toBe(mockErr)
          expect(errCode).toBe('CODE')
          expect(sendEmail).toBe(mockSendEmail)
          sinon.assert.calledOnce(mockRes.send)
          done()
        }
      }

      ErrorHandler.__set__('Validator.startValidation', mockStartValidation)

      ErrorHandler.__set__('Logger', mockLogger)

      ErrorHandler.handleError({
        statusMessage: mockStatusMessage,
        err: mockErr,
        code: mockCode,
        sendEmail: mockSendEmail,
        res: mockRes,
      })
    })
  })
})
