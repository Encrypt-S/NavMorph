'use strict'

const expect = require('expect')
const rewire = require('rewire')
const sinon = require('sinon')
const mongoose = require('mongoose')

let sandbox
let TransactionCtrl = rewire('../server/lib/db/transaction.ctrl')
let mockLogger = { writeLog: () => {} }
let TransactionModel = require('../server/lib/db/transaction.model')

describe('[TransactionCtrl]', () => {
  describe('(handleError)', () => {
    beforeEach(() => { // reset the rewired functions
      TransactionCtrl = rewire('../server/lib/db/transaction.ctrl')
      TransactionCtrl.__set__('Logger', mockLogger)
    })
    it('should send the error via the response and call writeLog', (done) => {
      const res = {
        send: (response) => {
          const jsonResponse = JSON.parse(response)
          expect(jsonResponse.type).toBe('FAIL')
          expect(jsonResponse.code).toBe(code)
          expect(jsonResponse.err).toBe(err)
          expect(jsonResponse.message).toBe(message)
          done()
        },
      }

      mockLogger = { writeLog: (errCode, statusMessage, error, mail) => {
        expect(errCode).toBe(code)
        expect(statusMessage).toBe(message)
        expect(error.error).toBe(err)
        expect(mail).toBe(true)
      } }
      TransactionCtrl.__set__('Logger', mockLogger)

      const err = 'test_error'
      const code = 'TEST_001'
      const message = 'This is a test error'
      TransactionCtrl.handleError(err, res, code, message)
    })
  })

  describe('(createTransaction)', () => {
    beforeEach(() => { // reset the rewired functions
      TransactionCtrl = rewire('../server/lib/db/transaction.ctrl')
    })
    it('should fail on req params', (done) => {
      const res = {
        send: () => {
        },
      }
      const req = {
        params: {
          junkParam: 'ASDF',
        },
      }
      TransactionCtrl.createTransaction(req, res)
      .catch((error) => {
        expect(error.toString().includes('PARAMS_ERROR')).toBe(true)
        done()
      })
    })

    it('should catch when it fails to save', (done) => {
      const res = {
        send: () => {
        },
      }
      const req = {
        params: {
          from: '',
          to: '',
          address: '',
          amount: '',
          extraId: '',
          polymorphId: '',
          polymorphPass: '',
          changellyAddressOne: '',
          changellyAddressTwo: '',
          navAddress: '',
        },
      }

      TransactionCtrl.__set__('TransactionModel.save', () => {
        console.log('IM HEREERERE')
        Promise.reject('FAIL')
      })
      TransactionCtrl.createTransaction(req, res)
      .catch((error) => {
        console.log(error)
        expect(error).toBe('FAIL')
        done()
      })
    })

    it('should recieve the correct params and save', (done) => {
      const req = {
        params: {
          from: '',
          to: '',
          address: '',
          amount: '',
          extraId: '',
          polymorphId: '',
          polymorphPass: '',
          changellyAddressOne: '',
          changellyAddressTwo: '',
          navAddress: '',
        },
      }

      TransactionModel.save = () => { return new Promise((fulfill) => { fulfill() }) }

      TransactionCtrl.createTransaction(req, {})
      .then(() => {
        done()
      })
    })
  })

  describe('(getTransaction)', () => {
    beforeEach(() => { // reset the rewired functions
      sandbox = sinon.sandbox.create()
      TransactionCtrl = rewire('../server/lib/db/transaction.ctrl')
    })
    afterEach(() => { // reset the rewired functions
      sandbox.restore()
    })
    it('should fetch one transaction', (done) => {
      const res = {
        send: () => {
        },
      }
      const req = {
        params: {
          id: '1234',
        },
      }
      const mockFind = {
        where: () => {
          return {
            equals: () => {},
          }
        },
        exec: (callback) => {
          expect(callback).toBe(TransactionCtrl.gotTransaction)
          done()
        },
      }
      sandbox.stub(mongoose.Model, 'find').returns(mockFind)
      TransactionCtrl.getTransaction(req, res)
    })
    it('should fetch all transactions', (done) => {
      const res = {
        send: () => {
        },
      }
      const req = {
        params: {},
      }
      const mockFind = {
        exec: (callback) => {
          expect(callback).toBe(TransactionCtrl.gotTransaction)
          done()
        },
      }
      sandbox.stub(mongoose.Model, 'find').returns(mockFind)
      TransactionCtrl.getTransaction(req, res)
    })
  })
  describe('(gotTransaction)', () => {
    beforeEach(() => { // reset the rewired functions
      TransactionCtrl = rewire('../server/lib/db/transaction.ctrl')
    })
    it('should fetch transactions failure', (done) => {
      TransactionCtrl.handleError = (err, res, code) => {
        expect(code).toBe('TC_003')
        done()
      }
      TransactionCtrl.runtime = {
        res: {},
        req: {},
      }
      TransactionCtrl.gotTransaction(true, null)
    })

    it('should fetch transactions success', (done) => {
      TransactionCtrl.handleError = (err, res, code) => {
        expect(code).toBe('TC_003')
        done()
      }
      TransactionCtrl.runtime = {
        res: {
          send: (response) => {
            const jsonResponse = JSON.parse(response)
            expect(jsonResponse.type).toBe('SUCCESS')
            expect(jsonResponse.status).toBe(200)
            expect(jsonResponse.data).toEqual(transactions)
            done()
          },
        },
        req: {
          params: {},
        },
      }

      const transactions = [
        {
          _id: 'QWERT',
          output_currency: 'NAV',
          output_address: '1111',
          changelly_address: '2222',
        },
        {
          _id: 'QWERT',
          output_currency: 'XMR',
          output_address: '3333',
          changelly_address: '4444',
        },
      ]

      TransactionCtrl.gotTransaction(false, transactions)
    })
  })
})
