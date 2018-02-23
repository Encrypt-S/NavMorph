'use strict'

const expect = require('expect')
const rewire = require('rewire')
let client = rewire('../src/lib/rpc/client')


describe('[Rpc]', () => {
  describe('(unlockWallet)', () => {
    beforeEach(() => { // reset the rewired functions
      client = rewire('../src/lib/rpc/client')
      const mockUnknownError = new Error()
      const mockLogger = { writeLog: () => {} }
      client.__set__('logger', mockLogger)
    })
    it('should return false of unknown error', (done) => {
      const mockUnknownError = new Error()
      const mockRpc = { walletPassphrase: () => Promise.reject({ message: 'unknown'}) }
      client.__set__('rpc', mockRpc)

      client.unlockWallet().then(result => {
        expect(result).toBe(false)
        done()
      })
    })
    it('should return true for unencrypted error', (done) => {
      const mockUnknownError = new Error()
      const mockRpc = { walletPassphrase: () => Promise.reject({ message: 'unencrypted'}) }
      client.__set__('rpc', mockRpc)

      client.unlockWallet().then(result => {
        expect(result).toBe(true)
        done()
      })
    })

    it('should return true for successful unlocked', (done) => {
      const mockUnknownError = new Error()
      const mockRpc = { walletPassphrase: () => Promise.resolve() }
      client.__set__('rpc', mockRpc)

      client.unlockWallet().then(result => {
        expect(result).toBe(true)
        done()
      })
    })
  })
})
