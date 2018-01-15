'use strict'

const expect = require('expect')
const rewire = require('rewire')

let Rpc = rewire('../server/lib/rpc/get-info')
let mockLogger = { writeLog: () => {} }

describe('[Rpc]', () => {
  describe('(getInfo)', () => {
    beforeEach(() => { // reset the rewired functions
      Rpc = rewire('../server/lib/rpc/get-info')
      mockLogger = { writeLog: () => {} }
      Rpc.__set__('Logger', mockLogger)
    })
    it('should reject errors', (done) => {
      Rpc.navClient = {
        getInfo: () => { return Promise.reject({ code: -17 }) },
      }

      Rpc.getInfo()
      .catch((err) => {
        expect(err.code).toBe(-17)
        done()
      })
    })

    it('should run the command with params and succeed', (done) => {
      Rpc.navClient = {
        getInfo: () => { return Promise.resolve({ code: 200 }) },
      }
      Rpc.getInfo()
      .then((data) => {
        expect(data.code).toBe(200)
        done()
      })
    })
  })
})
