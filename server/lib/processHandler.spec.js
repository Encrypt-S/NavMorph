'use strict'

const expect = require('expect')
const rewire = require('rewire')
const sinon = require('sinon')

let ProcessHandler = rewire('../server/lib/processHandler')
let mockLogger = { writeLog: () => {} }

describe('[ProcessHandler]', () => {
  describe('(setup)', () => {
    beforeEach(() => { // reset the rewired functions
      ProcessHandler = rewire('../server/lib/processHandler')
      mockLogger = { writeLog: () => {} }
      ProcessHandler.__set__('Logger', mockLogger)
    })
    it('should testRpc then startTimer', (done) => {
      ProcessHandler.testRpc = () => {
        expect(true).toBe(true)
        return Promise.resolve()
      }
      const timerSpy = sinon.spy(ProcessHandler, 'startTimer')

      ProcessHandler.setup()
      .then(() => {
        sinon.assert.called(timerSpy)
        done()
      })
    })

    it('should catch errors from testRpc, then writeLog', (done) => {
      ProcessHandler.navClient = {
        getInfo: () => { return Promise.reject({ code: 200 }) },
      }
      ProcessHandler.getInfo()
      .then((data) => {
        expect(data.code).toBe(200)
        done()
      })
    })
  })


  describe('(testRpc)', () => {})
  //
  // describe('(startTimer)', () => {
  //   beforeEach(() => { // reset the rewired functions
  //     ProcessHandler = rewire('../server/lib/processHandler')
  //     mockLogger = { writeLog: () => {} }
  //     ProcessHandler.__set__('Logger', mockLogger)
  //   })
  //   it('should testRpc then startTimer', (done) => {
  //     ProcessHandler.navClient = {
  //       getInfo: () => { return Promise.reject({ code: -17 }) },
  //     }
  //
  //     ProcessHandler.getInfo()
  //     .catch((err) => {
  //       expect(err.code).toBe(-17)
  //       done()
  //     })
  //   })
  //
  //   it('should catch errors from testRpc, then writeLog', (done) => {
  //     ProcessHandler.navClient = {
  //       getInfo: () => { return Promise.resolve({ code: 200 }) },
  //     }
  //     ProcessHandler.getInfo()
  //     .then((data) => {
  //       expect(data.code).toBe(200)
  //       done()
  //     })
  //   })
  // })
  //
  // describe('(runTasks)', () => {}
  //
  // describe('(preflightChecks)', () => {
  //   beforeEach(() => { // reset the rewired functions
  //     ProcessHandler = rewire('../server/lib/processHandler')
  //     mockLogger = { writeLog: () => {} }
  //     ProcessHandler.__set__('Logger', mockLogger)
  //   })
  //   it('should testRpc then startTimer', (done) => {
  //     ProcessHandler.navClient = {
  //       getInfo: () => { return Promise.reject({ code: -17 }) },
  //     }
  //
  //     ProcessHandler.getInfo()
  //     .catch((err) => {
  //       expect(err.code).toBe(-17)
  //       done()
  //     })
  //   })
  //
  //   it('should catch errors from testRpc, then writeLog', (done) => {
  //     ProcessHandler.navClient = {
  //       getInfo: () => { return Promise.resolve({ code: 200 }) },
  //     }
  //     ProcessHandler.getInfo()
  //     .then((data) => {
  //       expect(data.code).toBe(200)
  //       done()
  //     })
  //   })
  // })
  //
  // describe('(setTimerPaused)', () => {
  //   beforeEach(() => { // reset the rewired functions
  //     ProcessHandler = rewire('../server/lib/processHandler')
  //     mockLogger = { writeLog: () => {} }
  //     ProcessHandler.__set__('Logger', mockLogger)
  //   })
  //   it('should testRpc then startTimer', (done) => {
  //     ProcessHandler.navClient = {
  //       getInfo: () => { return Promise.reject({ code: -17 }) },
  //     }
  //
  //     ProcessHandler.getInfo()
  //     .catch((err) => {
  //       expect(err.code).toBe(-17)
  //       done()
  //     })
  //   })
  //
  //   it('should catch errors from testRpc, then writeLog', (done) => {
  //     ProcessHandler.navClient = {
  //       getInfo: () => { return Promise.resolve({ code: 200 }) },
  //     }
  //     ProcessHandler.getInfo()
  //     .then((data) => {
  //       expect(data.code).toBe(200)
  //       done()
  //     })
  //   })
  // })
})
