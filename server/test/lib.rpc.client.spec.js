const expect = require('expect')
const rewire = require('rewire')
let rpc = rewire('../src/lib/rpc/client')

describe('[Rpc]', () => {
  describe('(nav.unlockWallet)', () => {
    beforeEach(() => {
      // reset the rewired functions
      rpc = rewire('../src/lib/rpc/client')
      const mockUnknownError = new Error()
      const mockLogger = { writeErrorLog: () => {} }
      rpc.__set__('logger', mockLogger)
    })

    it("should return false when there's an unknown error", done => {
      rpc.walletPassphrase = () => {
        throw { message: 'unknown' }
      }

      rpc.nav.unlockWallet().then(result => {
        expect(result).toBe(false)
        done()
      })
    })

    it('should return true for unencrypted error', done => {
      const mockNav = () => {
        throw { message: 'unencrypted' }
      }
      rpc.walletPassphrase = mockNav

      rpc.nav.unlockWallet().then(result => {
        expect(result).toBe(true)
        done()
      })
    })

    it('should return true for successful unlocked', done => {
      const mockUnknownError = new Error()
      const mockNav = () => Promise.resolve()
      rpc.walletPassphrase = mockNav

      rpc.nav.unlockWallet().then(result => {
        expect(result).toBe(true)
        done()
      })
    })
  })

  describe('(nav.getNewAddress)', () => {
    beforeEach(() => {
      // reset the rewired functions
      rpc = rewire('../src/lib/rpc/client')
      const mockUnknownError = new Error()
      const mockLogger = { writeErrorLog: () => {} }
      rpc.__set__('logger', mockLogger)
    })

    it('should run and get an address', done => {
      rpc.getNewAddress = () => {
        return 'address'
      }

      rpc.nav.getNewAddress().then(data => {
        expect(data).toBe('address')
        done()
      })
    })

    it('should refill the keypool if the pool is empty, and return an address', done => {
      let keysAvailible = false
      let placeholder = rpc.nav

      rpc.getNewAddress = () => {
        if (keysAvailible) {
          return 'address'
        }
        const e = new Error()
        e.code = -12
        throw e
      }
      rpc.walletPassphrase = () => {}
      rpc.walletLock = () => {}
      rpc.keypoolRefill = () => {
        keysAvailible = true
      }
      rpc.keysAvailible = false

      rpc.nav.getNewAddress().then(data => {
        expect(data).toBe('address')
        done()
      })
    })

    it("should run getNewAddress and return false on any error thats doesn't have code = -12", done => {
      rpc.getNewAddress = () => {
        throw new Error()
      }

      rpc.nav.getNewAddress().then(data => {
        expect(data).toBe(false)
        done()
      })
    })

    it('should return false if getNewAddress errors twice', done => {
      let keypoolRefillCalled = false

      rpc.keypoolRefill = () => {
        return new Promise(fulfill => {
          keypoolRefillCalled = true
          fulfill()
        })
      }

      let errorCount = 0
      rpc.getNewAddress = () => {
        errorCount += 1
        let e = new Error()
        e.code = -12
        throw e
      }

      rpc.nav.getNewAddress().then(data => {
        expect(data === false && errorCount === 2 && keypoolRefillCalled).toBe(true)
        done()
      })
    })

    it('should return false if keypoolRefill errors', done => {
      let keypoolRefillCalled = false

      rpc.keypoolRefill = () => {
        keypoolRefillCalled = true
        throw new Error()
      }

      rpc.getNewAddress = () => {
        let e = new Error()
        e.code = -12
        throw e
      }

      rpc.nav.getNewAddress().then(data => {
        expect(data === false && keypoolRefillCalled).toBe(true)
        done()
      })
    })
  })
})
