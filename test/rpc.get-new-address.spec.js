'use strict'

const expect = require('expect')
const rewire = require('rewire')

let Rpc = rewire('../server/lib/rpc/client')

describe('[Rpc]', () => {
  describe('(getNewAddress)', () => {
    beforeEach(() => { // reset the rewired functions
      Rpc = rewire('../server/lib/rpc/get-new-address')
    })

    describe('(Rpc.internal.getNewAddress)', () => {
      it('should run and get an address', () => {
        Rpc.navClient = {
          getNewAddress: () => { return 'address' },
        }
        Rpc.internal.getNewAddress().then((data) => { expect(data).toBe('address') })
      })

      it('should refill the keypool if the pool is empty, and return an address', () => {
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
        Rpc.internal.getNewAddress().then((data) => { expect(data).toBe('address') })
      })

      it('should run internal.getNewAddress and reject any error thats doesn\'t have code = -12', () => {
        Rpc.navClient = {
          getNewAddress: () => { throw new Error() },
        }

        Rpc.internal.getNewAddress().catch((err) => { expect(err instanceof Error && err.code !== -12).toBe(true) })
      })

      it('should return an error if getNewAddress errors twice', () => {
        let keypoolRefillCalled = false

        Rpc.internal.keypoolRefill = () => {
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

        Rpc.internal.getNewAddress().catch((err) => {
          expect(err instanceof Error && errorCount === 2 && keypoolRefillCalled).toBe(true)
        })
      })
    })

    describe('(Rpc.internal.keypoolRefill)', () => {
      it('should run and catch any error', () => {
        Rpc.navClient = {
          walletPassphrase: () => {},
          walletLock: () => {},
          keypoolRefill: () => { throw new Error() },
        }

        Rpc.internal.keypoolRefill().catch((err) => { expect(err instanceof Error).toBe(true) })
      })

      it('should lock the wallet after filling pool', () => {
        let walletIsLocked
        Rpc.navClient = {
          walletPassphrase: () => { walletIsLocked = false },
          walletLock: () => { walletIsLocked = true },
          keypoolRefill: () => {},
        }

        Rpc.internal.keypoolRefill().then(() => { expect(walletIsLocked).toBe(true) })
      })
    })
  })
})
