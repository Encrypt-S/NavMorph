'use strict'

const expect = require('expect')
const rewire = require('rewire')

let Rpc = rewire('../server/lib/rpc/get-new-address')

describe('[Rpc]', () => {
  describe('(getNewAddress)', () => {
    beforeEach(() => { // reset the rewired functions
      Rpc = rewire('../server/lib/rpc/get-new-address')
    })

    describe('(Rpc.getNewAddress)', () => {
      it('should run and get an address', (done) => {
        Rpc.navClient = {
          getNewAddress: () => { return 'address' },
        }
        Rpc.getNewAddress().then((data) => {
          expect(data).toBe('address')
          done()
        })
      })

      it('should refill the keypool if the pool is empty, and return an address', (done) => {
        let keysAvailible = false
        Rpc.navClient = {
          getNewAddress: () => {
            if (keysAvailible) {
              return 'address'
            }
            const e = new Error()
            e.code = -12
            throw e
          },
          walletPassphrase: () => {},
          walletLock: () => {},
          keypoolRefill: () => {
            keysAvailible = true
          },
        }
        Rpc.getNewAddress().then((data) => {
          expect(data).toBe('address')
          done()
        })
      })

      it('should run getNewAddress and reject any error thats doesn\'t have code = -12', (done) => {
        Rpc.navClient = {
          getNewAddress: () => { throw new Error() },
        }

        Rpc.getNewAddress().catch((err) => {
          expect(err instanceof Error && err.code !== -12).toBe(true)
          done()
        })
      })

      it('should return an error if getNewAddress errors twice', (done) => {
        let keypoolRefillCalled = false

        Rpc.keypoolRefill = () => {
          return new Promise((fulfill) => {
            keypoolRefillCalled = true
            fulfill()
          })
        }

        let errorCount = 0
        Rpc.navClient = {
          getNewAddress: () => {
            errorCount += 1
            const e = new Error()
            e.code = -12
            throw e
          },
        }

        Rpc.getNewAddress().catch((err) => {
          expect(err instanceof Error && errorCount === 2 && keypoolRefillCalled).toBe(true)
          done()
        })
      })

      it('should reject an error if keypoolRefill errors', (done) => {
        const mockError = {
          err: 'ERR',
          code: -12,
        }

        Rpc.keypoolRefill = () => {
          return new Promise((ful, rej) => { rej(mockError) })
        }

        Rpc.navClient = {
          getNewAddress: () => { throw mockError },
        }

        Rpc.getNewAddress()
        .catch((err) => {
          expect(err).toBe(mockError)
          done()
        })
      })
    })

    describe('(Rpc.keypoolRefill)', (done) => {
      it('should run and catch any error', () => {
        Rpc.navClient = {
          walletPassphrase: () => {},
          walletLock: () => {},
          keypoolRefill: () => { throw new Error() },
        }

        Rpc.keypoolRefill().catch((err) => { expect(err instanceof Error).toBe(true) })
      })

      it('should lock the wallet after filling pool', (done) => {
        let walletIsLocked
        Rpc.navClient = {
          walletPassphrase: () => { walletIsLocked = false },
          walletLock: () => { walletIsLocked = true },
          keypoolRefill: () => {},
        }

        Rpc.keypoolRefill().then(() => {
          expect(walletIsLocked).toBe(true)
          done()
        })
      })
    })
  })
})
