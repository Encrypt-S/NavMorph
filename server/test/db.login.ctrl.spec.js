'use strict'

const expect = require('expect')
const rewire = require('rewire')
const sinon = require('sinon')

let LoginCtrl = rewire('../src/lib/db/login.ctrl')
let mockLogger = { writeErrorLog: sinon.spy() }

describe('[Login.Ctrl]', () => {
  describe('(insertAttempt)', () => {
    beforeEach(() => { // reset the rewired functions
      LoginCtrl = rewire('../src/lib/db/login.ctrl')
      mockLogger = { writeErrorLog: sinon.spy() }
      LoginCtrl.__set__('Logger', mockLogger)
    })

    it('should fail on params', (done) => {
      LoginCtrl.insertAttempt({ junkParam: '1234' })
        .catch((error) => {
          expect(error).toBe('LGN_001')
          sinon.assert.calledOnce(mockLogger.writeErrorLog)
          sinon.assert.calledWith(mockLogger.writeErrorLog, 'LGN_001')
          done()
        })
    })

    it('should get correct params', (done) => {
      const ipAddress = '192.168.10.1'
      const polymorphId = '123'
      const params = { test: 'test' }

      function mockFailedLoginsModel(paramsToSave) {
        mockFailedLoginsModel.params = paramsToSave
      }

      LoginCtrl.executeSave = () => {
        expect(mockFailedLoginsModel.params.ip_address).toBe(ipAddress)
        expect(mockFailedLoginsModel.params.polymorph_id).toBe(polymorphId)
        expect(mockFailedLoginsModel.params.params).toBe(JSON.stringify(params))
        expect(mockFailedLoginsModel.params.timestamp instanceof Date).toBe(true)
        sinon.assert.notCalled(mockLogger.writeErrorLog)
        done()
      }

      LoginCtrl.__set__('FailedLoginsModel', mockFailedLoginsModel)
      LoginCtrl.insertAttempt({ ipAddress, polymorphId, params })
    })
  })

  describe('(blackListIp)', () => {
    beforeEach(() => { // reset the rewired functions
      LoginCtrl = rewire('../src/lib/db/login.ctrl')
      mockLogger = { writeErrorLog: sinon.spy() }
      LoginCtrl.__set__('Logger', mockLogger)
    })

    it('should fail on params', (done) => {
      LoginCtrl.blackListIp({ junkParam: '1234' })
        .catch((error) => {
          expect(error).toBe('LGN_004')
          sinon.assert.calledOnce(mockLogger.writeErrorLog)
          sinon.assert.calledWith(mockLogger.writeErrorLog, 'LGN_004')
          done()
        })
    })

    it('should pass on params', (done) => {
      const blacklistSpy = sinon.spy(LoginCtrl, 'executeSave')
      const ipAddress = '1.1.1.1'

      mockLogger = { writeErrorLog: sinon.spy() }
      LoginCtrl.__set__('Logger', mockLogger)

      function mockBlacklistModel(paramsToSave) {
        this.params = paramsToSave
      }

      LoginCtrl.executeSave = (fulfill, reject) => {
        expect(LoginCtrl.runtime.transaction.params.ip_address).toBe(ipAddress)
        expect(LoginCtrl.runtime.transaction.params.timestamp instanceof Date).toBe(true)
        sinon.assert.notCalled(mockLogger.writeErrorLog)
        done()
      }

      LoginCtrl.__set__('BlackListModel', mockBlacklistModel)
      LoginCtrl.blackListIp({ ipAddress })
    })
  })

  describe('(executeSave)', () => {
    beforeEach(() => { // reset the rewired functions
      LoginCtrl = rewire('../src/lib/db/login.ctrl')
      mockLogger = { writeErrorLog: sinon.spy() }
      LoginCtrl.__set__('Logger', mockLogger)
    })

    it('should handle save success', (done) => {
      LoginCtrl.runtime.transaction = {
        save: () => { return Promise.resolve('SUCCESS') },
      }

      function fulfill(result) {
        expect(result).toBe('SUCCESS')
        sinon.assert.notCalled(mockLogger.writeErrorLog)
        done()
      }

      LoginCtrl.executeSave(fulfill, null)
    })

    it('should handle save failure', (done) => {
      LoginCtrl.runtime.transaction = {
        save: () => { return Promise.reject(new Error('SAVE_FAILED')) },
      }

      function reject(result) {
        expect(result.message).toBe('SAVE_FAILED')
        sinon.assert.calledOnce(mockLogger.writeErrorLog)
        sinon.assert.calledWith(mockLogger.writeErrorLog, 'LGN_002')
        done()
      }
      LoginCtrl.executeSave(null, reject)
    })

    it('should handle exceptions', (done) => {
      function Exception(message) {
        this.error = message
      }

      LoginCtrl.runtime.transaction = {
        save: () => { throw new Exception('SAVE_EXCEPTION') },
      }

      function reject(result) {
        expect(result.error).toBe('SAVE_EXCEPTION')
        sinon.assert.calledOnce(mockLogger.writeErrorLog)
        sinon.assert.calledWith(mockLogger.writeErrorLog, 'LGN_003')
        done()
      }

      LoginCtrl.executeSave(null, reject)
    })
  })

  describe('(checkIpBlocked)', () => {
    beforeEach(() => { // reset the rewired functions
      LoginCtrl = rewire('../src/lib/db/login.ctrl')
      mockLogger = { writeErrorLog: sinon.spy() }
      LoginCtrl.__set__('Logger', mockLogger)
    })

    it('should fail on params', (done) => {
      LoginCtrl.checkIpBlocked({ junkParam: '1234' })
        .catch((error) => {
          expect(error).toBe('LGN_005')
          sinon.assert.calledOnce(mockLogger.writeErrorLog)
          sinon.assert.calledWith(mockLogger.writeErrorLog, 'LGN_005')
          done()
        })
    })

    it('should pass on params', (done) => {
      const ipAddress = '1.1.1.1'
      const mockResult = 'MOCK'
      const mockBlacklistModel = {
        find: () => mockBlacklistModel,
        and: (paramsToSave) => {
          mockBlacklistModel.params = paramsToSave
          return mockBlacklistModel
        },
        select: () => mockBlacklistModel,
        exec: () => new Promise(ful => ful(mockResult)),
        params: {},
      }
      LoginCtrl.__set__('BlackListModel', mockBlacklistModel)

      LoginCtrl.checkResults = (res, min, fufill) => fufill(res)

      LoginCtrl.checkIpBlocked({ ipAddress })
      .then((result) => {
        expect(mockBlacklistModel.params[0].ip_address).toBe(ipAddress)
        expect(mockBlacklistModel.params[1].timestamp.$gte instanceof Date).toBe(true)
        expect(result).toBe(mockResult)
        done()
      })
    })

    it('should catch rejections', (done) => {
      const ipAddress = '1.1.1.1'
      const mockResult = 'MOCK'
      const mockBlacklistModel = {
        find: () => mockBlacklistModel,
        and: (paramsToSave) => {
          mockBlacklistModel.params = paramsToSave
          return mockBlacklistModel
        },
        select: () => mockBlacklistModel,
        exec: () => new Promise((ful, rej) => rej(mockResult)),
        params: {},
      }
      LoginCtrl.__set__('BlackListModel', mockBlacklistModel)

      LoginCtrl.checkIpBlocked({ ipAddress })
      .catch((result) => {
        expect(result).toBe(mockResult)
        done()
      })
    })
  })

  describe('(checkIfSuspicious)', () => {
    beforeEach(() => { // reset the rewired functions
      LoginCtrl = rewire('../src/lib/db/login.ctrl')
      mockLogger = { writeErrorLog: sinon.spy() }
      LoginCtrl.__set__('Logger', mockLogger)
    })

    it('should call run with params', (done) => {
      const ipAddress = '1.1.1.1'
      const mockResult = 'RESULT'

      const mockFailedLoginsModel = {
        find: function () { return this },
        and: function () {
          return this
        },
        select: function () { return this },
        params: {},
        exec: function () {
          return Promise.resolve(mockResult)
        },
      }

      LoginCtrl.__set__('FailedLoginsModel', mockFailedLoginsModel)

      LoginCtrl.checkResults = (result, minLength, fulfill) => {
        expect(result).toBe(mockResult)
        expect(minLength).toBe(10)
        expect(fulfill).toBeTruthy()
        done()
      }

      LoginCtrl.checkIfSuspicious({ ipAddress })
    })

    it('should handle query failure', (done) => {
      const ipAddress = '1.1.1.1'
      const mockResult = 'FAIL'

      const mockFailedLoginsModel = {
        find: function () { return this },
        and: function () {
          return this
        },
        select: function () { return this },
        params: {},
        exec: function () {
          return Promise.reject(mockResult)
        },
      }

      LoginCtrl.__set__('FailedLoginsModel', mockFailedLoginsModel)

      LoginCtrl.checkIfSuspicious({ ipAddress })
      .catch((error) => {
        expect(error).toBe(mockResult)
        done()
      })
    })

    describe('(checkResults)', () => {
      beforeEach(() => { // reset the rewired functions
        LoginCtrl = rewire('../src/lib/db/login.ctrl')
      })

      it('should pass a check', (done) => {
        const mockResult = [1, 2]
        const minLength = 0

        function fulfill(result) {
          expect(result).toBe(true)
          done()
        }

        LoginCtrl.checkResults(mockResult, minLength, fulfill, null)
      })

      it('should fail a check', (done) => {
        const mockResult = [1, 2]
        const minLength = 3

        function fulfill(result) {
          expect(result).toBe(false)
          done()
        }
        LoginCtrl.checkResults(mockResult, minLength, fulfill, null)
      })
    })
  })
})
