'use strict'

const expect = require('expect')
const rewire = require('rewire')
const sinon = require('sinon')
const mongoose = require('mongoose')

let sandbox
let TransactionCtrl = rewire('../src/lib/db/transaction.ctrl')
let TransactionModel = require('../src/lib/db/transaction.model')
let errorHandler = rewire('../src/lib/error-handler') // eslint-disable-line

describe('[TransactionCtrl]', () => {
  describe('(createTransaction)', () => {
    beforeEach(() => {
      // reset the rewired functions
      TransactionCtrl = rewire('../src/lib/db/transaction.ctrl')
    })
    it('should fail on req params', done => {
      const fakeRes = {
        send: () => {},
      }
      const fakeReq = {
        params: {
          junkParam: 'ASDF',
        },
      }

      TransactionCtrl.createTransaction(null, fakeRes).catch(error => {
        expect(error.toString().includes('PARAMS_ERROR')).toBe(true)
      })
      TransactionCtrl.createTransaction(fakeReq, fakeRes).catch(error => {
        expect(error.toString().includes('PARAMS_ERROR')).toBe(true)
        done()
      })
    })

    it('should catch when it fails to save', done => {
      const fakeError = { err: 'ERROR' }
      const res = {
        send: () => {},
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

      function mockModel(obj) {
        this.options = obj
        this.save = () => {
          return new Promise((ful, rej) => rej(fakeError))
        }
      }

      TransactionCtrl.__set__('TransactionModel', mockModel)
      TransactionCtrl.createTransaction(req, res).catch(error => {
        expect(error).toBe(fakeError)
        done()
      })
    })

    it('should recieve the correct params and save', done => {
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

      function mockModel(obj) {
        this.options = obj
        this.save = () => {
          return new Promise(ful => ful())
        }
      }

      TransactionCtrl.__set__('TransactionModel', mockModel)
      TransactionCtrl.createTransaction(req, {}).then(() => {
        done()
      })
    })
  })

  describe('(getOrder)', () => {
    beforeEach(() => {
      // reset the rewired functions
      sandbox = sinon.sandbox.create()
      TransactionCtrl = rewire('../src/lib/db/transaction.ctrl')
    })
    afterEach(() => {
      // reset the rewired functions
      sandbox.restore()
    })
    it('should fail on params', done => {
      TransactionCtrl.getOrder(null).catch(err => {
        expect(err instanceof Error).toBe(true)
        done()
      })
    })

    it('should pass on params and catch rejections', done => {
      const mockId = '10'
      const mockResult = { prop: 'FAKE' }

      const mockFind = {
        select: () => {},
        and: opts => {
          expect(opts).toEqual([{ polymorph_id: mockId }])
        },
        exec: () => {
          return new Promise((ful, rej) => {
            rej(mockResult)
          })
        },
      }
      sandbox.stub(TransactionModel, 'find').returns(mockFind)
      TransactionCtrl.getOrder(mockId).catch(result => {
        expect(result).toBe(mockResult)
        done()
      })
    })

    it('should pass on params and return result', done => {
      const mockId = '10'
      const mockResult = [{ prop: 'FAKE' }]

      const mockFind = {
        select: () => mockFind,
        and: opts => {
          expect(opts).toEqual([{ polymorph_id: mockId }])
          return mockFind
        },
        exec: () => Promise.resolve(mockResult),
      }
      sandbox.stub(TransactionModel, 'find').returns(mockFind)
      TransactionCtrl.getOrder(mockId).then(result => {
        expect(result).toBe(mockResult[0])
        done()
      })
    })
  })

  describe('(getTransaction)', () => {
    beforeEach(() => {
      // reset the rewired functions
      sandbox = sinon.sandbox.create()
      TransactionCtrl = rewire('../src/lib/db/transaction.ctrl')
    })
    afterEach(() => {
      // reset the rewired functions
      sandbox.restore()
    })
    it('should fetch one transaction', done => {
      const res = {
        send: () => {},
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
        exec: callback => {
          expect(callback).toBe(TransactionCtrl.gotTransaction)
          done()
        },
      }
      sandbox.stub(mongoose.Model, 'find').returns(mockFind)
      TransactionCtrl.getTransaction(req, res)
    })
    it('should fetch all transactions', done => {
      const res = {
        send: () => {},
      }
      const req = {
        params: {},
      }
      const mockFind = {
        exec: callback => {
          expect(callback).toBe(TransactionCtrl.gotTransaction)
          done()
        },
      }
      sandbox.stub(mongoose.Model, 'find').returns(mockFind)
      TransactionCtrl.getTransaction(req, res)
    })
  })

  describe('(gotTransaction)', () => {
    beforeEach(() => {
      // reset the rewired functions
      TransactionCtrl = rewire('../src/lib/db/transaction.ctrl')
      errorHandler = rewire('../src/lib/error-handler')
    })
    it('should catch transactions failure', done => {
      const mockErrorHandler = {
        handleError: params => {
          expect(params.code).toBe('TRANS_CTRL_003')
          done()
        },
      }

      TransactionCtrl.runtime = {
        res: {},
        req: {},
      }

      TransactionCtrl.__set__('errorHandler', mockErrorHandler)

      TransactionCtrl.gotTransaction(true, null)
    })

    it('should fetch transactions success', done => {
      TransactionCtrl.handleError = params => {
        expect(params.code).toBe('TRANS_CTRL_003')
        done()
      }
      TransactionCtrl.runtime = {
        res: {
          send: response => {
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

  describe('(updateOrderStatusRoute)', () => {
    beforeEach(() => {
      // reset the rewired functions
      sandbox = sinon.sandbox.create()
      TransactionCtrl = rewire('../src/lib/db/transaction.ctrl')
    })
    afterEach(() => {
      // reset the rewired functions
      sandbox.restore()
    })

    it('should fail on params and reject', done => {
      const fakeId = '100'
      const fakePass = 'PASS'
      const fakeStatus = 'SUNNY WITH A CHANCE OF SHOWERS'

      TransactionCtrl.updateOrderStatus(null, fakePass, fakeStatus).catch(err => {
        expect(err instanceof Error).toBe(true)
      })

      TransactionCtrl.updateOrderStatus(fakeId, null, fakeStatus).catch(err => {
        expect(err instanceof Error).toBe(true)
      })

      TransactionCtrl.updateOrderStatus(fakeId, fakePass, null).catch(err => {
        expect(err instanceof Error).toBe(true)
        done()
      })
    })

    it('should pass on params and catch a rejection', done => {
      const fakeId = '100'
      const fakePass = 'PASS'
      const fakeStatus = 'SUNNY WITH A CHANCE OF SHOWERS'
      const mockFindOneAndUpdate = (query, orderStatusObj) => {
        return new Promise((ful, rej) => {
          expect(query.polymorph_id).toBe(fakeId)
          expect(query.polymorph_pass).toBe(fakePass)
          expect(orderStatusObj.order_status).toBe(fakeStatus)
          rej('ERROR')
        })
      }
      TransactionCtrl.__set__('TransactionModel.findOneAndUpdate', mockFindOneAndUpdate)
      TransactionCtrl.updateOrderStatus(fakeId, fakePass, fakeStatus).catch(err => {
        expect(err).toBe('ERROR')
        done()
      })
    })

    it('should pass on params and fulfill', done => {
      const fakeId = '100'
      const fakePass = 'PASS'
      const fakeStatus = 'SUNNY WITH A CHANCE OF SHOWERS'
      const mockFindOneAndUpdate = (query, orderStatusObj) => {
        return new Promise(ful => {
          expect(query.polymorph_id).toBe(fakeId)
          expect(query.polymorph_pass).toBe(fakePass)
          expect(orderStatusObj.order_status).toBe(fakeStatus)
          ful()
        })
      }
      TransactionCtrl.__set__('TransactionModel.findOneAndUpdate', mockFindOneAndUpdate)
      TransactionCtrl.updateOrderStatus(fakeId, fakePass, fakeStatus).then(() => {
        done()
      })
    })
  })
})
