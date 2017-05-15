'use strict'

const expect = require('expect')
const rewire = require('rewire')

let Rpc = rewire('../server/lib/rpc')

describe('[Rpc]', () => {
  describe('(getInfo)', () => {
    beforeEach(() => { // reset the rewired functions
      Rpc = rewire('../server/lib/rpc')
    })
    it('should run getinfo and fail the rpc call', (done) => {
      Rpc.navClient = {
        getInfo: () => { return Promise.reject({ code: -17 }) },
      }
      const res = {
        send: (response) => {
          const jsonResponse = JSON.parse(response)
          expect(jsonResponse.type).toBe('FAIL')
          expect(jsonResponse.code).toBe('RPC_002')
          expect(jsonResponse.error.code).toBe(-17)
          expect(jsonResponse.status).toBe(200)
          expect(jsonResponse.message).toBeA('string')
          done()
        },
      }
      const req = {}
      Rpc.getInfo(req, res)
    })
    it('should run getinfo and throw an error', (done) => {
      Rpc.navClient = {
        getInfo: () => { throw new Exception() },
      }
      const res = {
        send: (response) => {
          const jsonResponse = JSON.parse(response)
          expect(jsonResponse.type).toBe('FAIL')
          expect(jsonResponse.code).toBe('RPC_001')
          expect(jsonResponse.status).toBe(200)
          expect(jsonResponse.message).toBeA('string')
          done()
        },
      }
      const req = {}
      Rpc.getInfo(req, res)
    })
    it('should run the command with params and succeed', (done) => {
      Rpc.navClient = {
        getInfo: () => { return Promise.resolve({ code: 200 }) },
      }
      const res = {
        send: (response) => {
          const jsonResponse = JSON.parse(response)
          expect(jsonResponse.type).toBe('SUCCESS')
          done()
        },
      }
      const req = {}
      Rpc.getInfo(req, res)
    })
  })
})
