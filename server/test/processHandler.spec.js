'use strict'

const expect = require('expect')
const rewire = require('rewire')
const sinon = require('sinon')

let ProcessHandler = rewire('../server/lib/processHandler')
let mockLogger = { writeLog: sinon.spy() }

describe('[ProcessHandler]', () => {
  describe('(setup)', () => {
    beforeEach(() => { // reset the rewired functions
      ProcessHandler = rewire('../server/lib/processHandler')
      mockLogger = { writeLog: sinon.spy() }
      ProcessHandler.__set__('Logger', mockLogger)
    })

    it('should testRpc then startTimer', (done) => {
      ProcessHandler.testRpc = () => {
        return Promise.resolve()
      }
      const mockTimer = () => {}
      ProcessHandler.startTimer = mockTimer

      const timerSpy = sinon.spy(ProcessHandler, 'startTimer')
      const testRpcSpy = sinon.spy(ProcessHandler, 'testRpc')


      ProcessHandler.setup()
      .then(() => {
        sinon.assert.called(timerSpy)
        sinon.assert.called(testRpcSpy)
        done()
      })
    })

    it('should catch errors from testRpc, then writeLog', (done) => {
      ProcessHandler.testRpc = () => {
        return Promise.reject()
      }
      ProcessHandler.setTimerPaused = () => {}
      const pauseSpy = sinon.spy(ProcessHandler, 'setTimerPaused')

      ProcessHandler.setup()
      .catch(() => {
        sinon.assert.called(pauseSpy.withArgs(true))
        sinon.assert.calledOnce(mockLogger.writeLog)

        done()
      })
    })
  })


  // describe('(testRpc)', () => {})

  describe('(startTimer)', () => {
    beforeEach(() => { // reset the rewired functions
      ProcessHandler = rewire('../server/lib/processHandler')
    })
    it('should run setInterval with specific args', (done) => {
      this.clock = sinon.useFakeTimers()
      const intervalSpy = sinon.spy(global, 'setInterval')
      ProcessHandler.runTasks = () => {}
      const handlerSpy = sinon.spy(ProcessHandler, 'runTasks')

      ProcessHandler.startTimer()
      this.clock.tick(120000 + 1) // Same as server settings timerLength + 1
      sinon.assert.called(intervalSpy)
      sinon.assert.called(handlerSpy)
      this.clock.restore()
      done()
    })
  })

  // describe('(runTasks)', () => {})

  // describe('(preflightChecks)', () => {})

  describe('(setTimerPaused)', () => {
    beforeEach(() => { // reset the rewired functions
      ProcessHandler = rewire('../server/lib/processHandler')
    })
    it('should unpause/pause the timer', () => {
      ProcessHandler.timerPaused = true

      ProcessHandler.setTimerPaused(false)
      expect(ProcessHandler.timerPaused).toBe(false)
      ProcessHandler.setTimerPaused(true)
      expect(ProcessHandler.timerPaused).toBe(true)
    })
  })
})
