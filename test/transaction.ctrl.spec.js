'use strict'

const expect = require('expect')
const rewire = require('rewire')
const sinon = require('sinon')
const mongoose = require('mongoose')

let sandbox
let TransactionCtrl = rewire('../server/lib/db/transaction.ctrl')
const TransactionModel = require('../server/lib/db/transaction.model')

describe('[TransactionCtrl]', () => {
  describe('(handleError)', () => {
    beforeEach(() => { // reset the rewired functions
      TransactionCtrl = rewire('../server/lib/db/transaction.ctrl')
    })
    it('should send the error to the response', (done) => {
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
    it('should fail on body param', (done) => {
      TransactionCtrl.handleError = (err, res, code) => {
        expect(code).toBe('TC_001')
        done()
      }
      const res = {
        send: () => {
        },
      }
      const req = {
        junkParam: 'ASDF',
      }
      TransactionCtrl.createTransaction(req, res)
    })
    it('should fail on body required params', (done) => {
      TransactionCtrl.handleError = (err, res, code) => {
        expect(code).toBe('TC_001')
        done()
      }
      const res = {
        send: () => {
        },
      }
      const req = {
        body: {
          junkParam: 'ASDF',
          output_currency: 'NAV',
        },
      }
      TransactionCtrl.createTransaction(req, res)
    })
    it('should recieve the correct params and save', (done) => {
      const res = {
        send: () => {
        },
      }
      const req = {
        body: {
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
      const saveStub = sinon.stub(TransactionModel.prototype, 'save')
      TransactionCtrl.createTransaction(req, res)
      sinon.assert.calledOnce(saveStub)
      done()
    })
  })
  describe('(savedTransaction)', () => {
    beforeEach(() => { // reset the rewired functions
      TransactionCtrl = rewire('../server/lib/db/transaction.ctrl')
    })
    it('should fail on mongoose error', (done) => {
      TransactionCtrl.handleError = (err, res, code) => {
        expect(code).toBe('TC_002')
        done()
      }
      TransactionCtrl.runtime = {
        res: {
          send: () => {
          },
        },
        req: {
          junkParam: 'ASDF',
        },
      }
      TransactionCtrl.savedTransaction(true)
    })
    it('should succeed', (done) => {
      TransactionCtrl.handleError = (err, res, code) => {
        expect(code).toBe('TC_002')
        done()
      }
      TransactionCtrl.runtime = {
        res: {
          send: (response) => {
            const jsonResponse = JSON.parse(response)
            expect(jsonResponse.type).toBe('SUCCESS')
            expect(jsonResponse.status).toBe(200)
            expect(jsonResponse.data).toEqual(TransactionCtrl.runtime.transaction)
            done()
          },
        },
        req: {
          junkParam: 'ASDF',
        },
        transaction: {
          junkParam: 'ASDF',
          output_currency: 'NAV',
          output_address: '0987',
          changelly_address: '1234',
        },
      }
      TransactionCtrl.savedTransaction()
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
