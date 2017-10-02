'use strict'

const expect = require('expect')
const rewire = require('rewire')
const sinon = require('sinon')

let LoginCtrl = rewire('../server/lib/db/login.ctrl')
let mockLogger = { writeLog: sinon.spy() }

describe('[Login.Ctrl]', () => {
  describe('(insertAttempt)', () => {
    beforeEach(() => { // reset the rewired functions
      LoginCtrl = rewire('../server/lib/db/login.ctrl')
      mockLogger = { writeLog: sinon.spy() }
      LoginCtrl.__set__('Logger', mockLogger)
    })
    it('should fail on params', (done) => {
      LoginCtrl.insertAttempt({ junkParam: '1234' })
        .catch((error) => {
          expect(error).toBe('LGN_001')
          sinon.assert.calledOnce(mockLogger.writeLog)
          sinon.assert.calledWith(mockLogger.writeLog, 'LGN_001')
          done()
        })
    })
    it('should get correct params', (done) => {
      const ipAddress = '192.168.10.1'
      const polymorphId = '123'
      const params = { test: 'test'}

      function mockFailedLoginsModel(paramsToSave) {
        mockFailedLoginsModel.params = paramsToSave
      }

      LoginCtrl.insertSave = (fulfill, reject) => {
        expect(mockFailedLoginsModel.params.ip_address).toBe(ipAddress)
        expect(mockFailedLoginsModel.params.polymorph_id).toBe(polymorphId)
        expect(mockFailedLoginsModel.params.params).toBe(JSON.stringify(params))
        expect(mockFailedLoginsModel.params.timestamp instanceof Date).toBe(true)
        sinon.assert.notCalled(mockLogger.writeLog)
        done()
      }

      LoginCtrl.__set__('FailedLoginsModel', mockFailedLoginsModel)
      LoginCtrl.insertAttempt({ ipAddress, polymorphId, params })
    })
  })
  describe('(insertSave)', () => {
    beforeEach(() => { // reset the rewired functions
      LoginCtrl = rewire('../server/lib/db/login.ctrl')
      mockLogger = { writeLog: sinon.spy() }
      LoginCtrl.__set__('Logger', mockLogger)
    })
    it('should handle save success', (done) => {

      LoginCtrl.runtime.transaction = {
        save: () => { return Promise.resolve('SUCCESS') },
      }

      function fulfill(result) {
        expect(result).toBe('SUCCESS')
        sinon.assert.notCalled(mockLogger.writeLog)
        done()
      }

      LoginCtrl.insertSave(fulfill, null)
    })
    it('should handle save failure', (done) => {
      LoginCtrl.runtime.transaction = {
        save: () => { return Promise.reject(new Error('SAVE_FAILED')) },
      }

      function reject(result) {
        expect(result.message).toBe('SAVE_FAILED')
        sinon.assert.calledOnce(mockLogger.writeLog)
        sinon.assert.calledWith(mockLogger.writeLog, 'LGN_002')
        done()
      }

      LoginCtrl.insertSave(null, reject)
    })
    it('should handle exceptions', (done) => {
      function Exception(message){
        this.error = message
      }

      LoginCtrl.runtime.transaction = {
        save: () => { throw new Exception('SAVE_EXCEPTION') },
      }

      function reject(result) {
        expect(result.error).toBe('SAVE_EXCEPTION')
        sinon.assert.calledOnce(mockLogger.writeLog)
        sinon.assert.calledWith(mockLogger.writeLog, 'LGN_003')
        done()
      }

      LoginCtrl.insertSave(null, reject)
    })
  })

  describe('(blackListIp)', () => {
    beforeEach(() => { // reset the rewired functions
      LoginCtrl = rewire('../server/lib/db/login.ctrl')
      mockLogger = { writeLog: sinon.spy() }
      LoginCtrl.__set__('Logger', mockLogger)
    })
    it('should fail on params', (done) => {
      LoginCtrl.blackListIp({ junkParam: '1234' })
        .catch((error) => {
          expect(error).toBe('LGN_004')
          sinon.assert.calledOnce(mockLogger.writeLog)
          sinon.assert.calledWith(mockLogger.writeLog, 'LGN_004')
          done()
        })
    })

    it('should pass on params', (done) => {
      const blacklistSpy = sinon.spy(LoginCtrl, 'insertIntoBlacklist')
      const ipAddress = '1.1.1.1'

      mockLogger = { writeLog: sinon.spy() }
      LoginCtrl.__set__('Logger', mockLogger)

      function mockBlacklistModel(paramsToSave) {
        mockBlacklistModel.params = paramsToSave
      }

      LoginCtrl.insertIntoBlacklist = (fulfill, reject) => {
        expect(LoginCtrl.runtime.transaction.ip_address).toBe(ipAddress)
        expect(LoginCtrl.runtime.transaction.timestamp instanceof Date).toBe(true)
        sinon.assert.notCalled(mockLogger.writeLog)
        done()
      }

      LoginCtrl.__set__('BlackListModel', mockBlacklistModel)
      LoginCtrl.blackListIp({ ipAddress })
    })
  })

  describe('(insertSave)', () => {
    beforeEach(() => { // reset the rewired functions
      LoginCtrl = rewire('../server/lib/db/login.ctrl')
      mockLogger = { writeLog: sinon.spy() }
      LoginCtrl.__set__('Logger', mockLogger)
    })
    it('should handle save success', (done) => {

      LoginCtrl.runtime.transaction = {
        save: () => { return Promise.resolve('SUCCESS') },
      }

      function fulfill(result) {
        expect(result).toBe('SUCCESS')
        sinon.assert.notCalled(mockLogger.writeLog)
        done()
      }

      LoginCtrl.insertIntoBlacklist(fulfill, null)
    })
    
    it('should handle save failure', (done) => {
      LoginCtrl.runtime.transaction = {
        save: () => { return Promise.reject(new Error('SAVE_FAILED')) },
      }

      function reject(result) {
        expect(result.message).toBe('SAVE_FAILED')
        sinon.assert.calledOnce(mockLogger.writeLog)
        sinon.assert.calledWith(mockLogger.writeLog, 'LGN_005')
        done()
      }

      LoginCtrl.insertIntoBlacklist(null, reject)
    })

    it('should handle exceptions', (done) => {
      function Exception(message){
        this.error = message
      }

      LoginCtrl.runtime.transaction = {
        save: () => { throw new Exception('SAVE_EXCEPTION') },
      }

      function reject(result) {
        expect(result.error).toBe('SAVE_EXCEPTION')
        sinon.assert.calledOnce(mockLogger.writeLog)
        sinon.assert.calledWith(mockLogger.writeLog, 'LGN_006')
        done()
      }

      LoginCtrl.insertIntoBlacklist(null, reject)
    })
  })
})
