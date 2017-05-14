'use strict'

const expect = require('expect')
const rewire = require('rewire')

let Rpc = rewire('../server/lib/rpc')

describe('[Rpc]', () => {
  describe('(navcoinRpc)', () => {
    beforeEach(() => { // reset the rewired functions
      Rpc = rewire('../server/lib/rpc')
    })
    it('should fail due to no body object', (done) => {
      const res = {
        send: (response) => {
          const jsonResponse = JSON.parse(response)
          expect(jsonResponse.type).toBe('FAIL')
          expect(jsonResponse.code).toBe('API_001')
          done()
        },
      }
      const req = {
        junkParam: 'ASDF',
      }
      Rpc.navcoinRpc(req, res)
    })
    it('should fail due to no command param', (done) => {
      const res = {
        send: (response) => {
          const jsonResponse = JSON.parse(response)
          expect(jsonResponse.type).toBe('FAIL')
          expect(jsonResponse.code).toBe('API_001')
          done()
        },
      }
      const req = {
        body: {
          junkParam: 'ASDF',
        },
      }
      Rpc.navcoinRpc(req, res)
    })
    it('should catch an error thrown by runCommand', (done) => {
      Rpc.runCommand = () => {
        throw new Exception()
      }
      const res = {
        send: (response) => {
          const jsonResponse = JSON.parse(response)
          expect(jsonResponse.type).toBe('FAIL')
          expect(jsonResponse.code).toBe('API_002')
          done()
        },
      }
      const req = {
        body: {
          command: 'ASDF',
        },
      }
      Rpc.navcoinRpc(req, res)
    })
    it('should call runCommand', (done) => {
      Rpc.runCommand = (req, res) => {
        expect(req).toBe(req)
        expect(res).toBe(res)
        done()
      }
      const res = {
        send: () => {},
      }
      const req = {
        body: {
          command: 'ASDF',
        },
      }
      Rpc.navcoinRpc(req, res)
    })
  })
  describe('(navcoinRpc)', () => {
    beforeEach(() => { // reset the rewired functions
      Rpc = rewire('../server/lib/rpc')
    })
    it('should fail because the command was not a function', (done) => {
      Rpc.navClient = {
        walletPassphrase: () => { return Promise.reject({ code: -17 }) },
      }
      const res = {
        send: (response) => {
          const jsonResponse = JSON.parse(response)
          expect(jsonResponse.type).toBe('FAIL')
          expect(jsonResponse.code).toBe('API_003')
          done()
        },
      }
      const req = {
        body: {
          command: 'ASDF',
        },
      }
      Rpc.runCommand(req, res)
    })
    it('should run the command with params and fail the rpc call', (done) => {
      Rpc.navClient = {
        walletPassphrase: () => { return Promise.reject({ code: -17 }) },
      }
      const res = {
        send: (response) => {
          const jsonResponse = JSON.parse(response)
          expect(jsonResponse.type).toBe('FAIL')
          done()
        },
      }
      const req = {
        body: {
          command: 'walletPassphrase',
          params: ['ASDF', 60],
        },
      }
      Rpc.runCommand(req, res)
    })
    it('should run the command without params and fail the rpc call', (done) => {
      Rpc.navClient = {
        walletPassphrase: () => { return Promise.reject({ code: -17 }) },
      }
      const res = {
        send: (response) => {
          const jsonResponse = JSON.parse(response)
          expect(jsonResponse.type).toBe('FAIL')
          done()
        },
      }
      const req = {
        body: {
          command: 'walletPassphrase',
        },
      }
      Rpc.runCommand(req, res)
    })
    it('should run the command with params and succeed', (done) => {
      Rpc.navClient = {
        walletPassphrase: () => { return Promise.resolve({ code: 200 }) },
      }
      const res = {
        send: (response) => {
          const jsonResponse = JSON.parse(response)
          expect(jsonResponse.type).toBe('SUCCESS')
          done()
        },
      }
      const req = {
        body: {
          command: 'walletPassphrase',
          params: ['ASDF', 60],
        },
      }
      Rpc.runCommand(req, res)
    })
    it('should run the command without params and succeed', (done) => {
      Rpc.navClient = {
        walletPassphrase: () => { return Promise.resolve({ code: 200 }) },
      }
      const res = {
        send: (response) => {
          const jsonResponse = JSON.parse(response)
          expect(jsonResponse.type).toBe('SUCCESS')
          done()
        },
      }
      const req = {
        body: {
          command: 'walletPassphrase',
        },
      }
      Rpc.runCommand(req, res)
    })
  })
})
