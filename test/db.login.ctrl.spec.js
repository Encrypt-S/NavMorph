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

      LoginCtrl.executeSave = (fulfill, reject) => {
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
      const blacklistSpy = sinon.spy(LoginCtrl, 'executeSave')
      const ipAddress = '1.1.1.1'

      mockLogger = { writeLog: sinon.spy() }
      LoginCtrl.__set__('Logger', mockLogger)

      function mockBlacklistModel(paramsToSave) {
        mockBlacklistModel.params = paramsToSave
      }

      LoginCtrl.executeSave = (fulfill, reject) => {
        expect(LoginCtrl.runtime.transaction.ip_address).toBe(ipAddress)
        expect(LoginCtrl.runtime.transaction.timestamp instanceof Date).toBe(true)
        sinon.assert.notCalled(mockLogger.writeLog)
        done()
      }

      LoginCtrl.__set__('BlackListModel', mockBlacklistModel)
      LoginCtrl.blackListIp({ ipAddress })
    })
  })

  describe('(executeSave)', () => {
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

      LoginCtrl.executeSave(fulfill, null)
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
      LoginCtrl.executeSave(null, reject)
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

      LoginCtrl.executeSave(null, reject)
    })
  })

  describe('(checkIpBlocked)', () => {
    beforeEach(() => { // reset the rewired functions
      LoginCtrl = rewire('../server/lib/db/login.ctrl')
      mockLogger = { writeLog: sinon.spy() }
      LoginCtrl.__set__('Logger', mockLogger)
    })

    it('should fail on params', (done) => {
      LoginCtrl.checkIpBlocked({ junkParam: '1234' })
        .catch((error) => {
          expect(error).toBe('LGN_005')
          sinon.assert.calledOnce(mockLogger.writeLog)
          sinon.assert.calledWith(mockLogger.writeLog, 'LGN_005')
          done()
        })
    })

    // it('should pass on params', (done) => {
    //   const executeIpSpy = sinon.spy(LoginCtrl, 'executeIpBlockedQuery')
    //   const ipAddress = '1.1.1.1'

    //   mockLogger = { writeLog: sinon.spy() }
    //   LoginCtrl.__set__('Logger', mockLogger)

    //   const mockBlacklistModel = {
    //     find: {
    //       and: (paramsToSave) => {
    //         console.log(paramsToSave)
    //       },
    //     },
        
    //   }

    //   LoginCtrl.executeIpBlockedQuery = (options) => {
    //     // console.log('options.query', options.query)
    //     expect(options.ip_address).toBe(ipAddress)
    //     expect(options.timestamp instanceof Date).toBe(true)
    //     sinon.assert.notCalled(mockLogger.writeLog)
    //     done()
    //   }

    //   LoginCtrl.__set__('BlackListModel', mockBlacklistModel)

    //   LoginCtrl.checkIpBlocked({ ipAddress })
    // })
  })

  describe('(executeIpBlockedQuery)', () => {
    beforeEach(() => { // reset the rewired functions
      LoginCtrl = rewire('../server/lib/db/login.ctrl')
    })

    it('should handle query success', (done) => {
      let query = {}
      query.exec = () => {
        return Promise.resolve('SUCCESS')
      }

      LoginCtrl.checkResults = (options) => {
        expect(options.result).toBe('SUCCESS')
        expect(options.result).toBe('SUCCESS')
        expect(options.limit).toBe(0)
        done()
      }

      LoginCtrl.executeIpBlockedQuery({ query })
    }) 

    // it('should handle query failure', (done) => {
    //   let query = {}
    //   query.exec = () => {
    //     return Promise.reject('QUERY_FAILED')
    //   }

    //   LoginCtrl.runtime.transaction = {
    //     save: () => { return Promise.reject(new Error('QUERY_FAILED')) },
    //   }

    //   function reject(result) {
    //     expect(result.message).toBe('QUERY_FAILED')
    //     sinon.assert.calledOnce(mockLogger.writeLog)
    //     sinon.assert.calledWith(mockLogger.writeLog, 'LGN_002')
    //     done()
    //   }
    //   LoginCtrl.executeIpBlockedQuery({ query, null, reject })
    // })
  })

})
