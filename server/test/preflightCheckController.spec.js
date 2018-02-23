const expect = require('expect')
const rewire = require('rewire')

let preflightCheckController = rewire('../src/lib/preflightCheckController')


describe('[preflightCheckController]', () => {
  describe('(startChecks)', () => {
    beforeEach(() => { // reset the rewired functions
      preflightCheckController = rewire('../src/lib/preflightCheckController')
    })

    it('should reject when wallet is locked', (done) => {
      let mockClient = {
        unlockWallet: () => false
      }
      preflightCheckController.__set__('client', mockClient)
      preflightCheckController.startChecks()
      .catch((err) => {
        expect(err).toBeA(Error)
        done()
      })
    })

    it('should reject if the block count is too far from network count', (done) => {
      let mockClient = {
        unlockWallet: () => true,
        getInfo: () => { blocks: 5 },
        getBlockCount: () => 10
      }
      let mockConfig = {
        preflightCheckController: {
          maxBlockHeightDiscrepency: 0
        }
      }
      preflightCheckController.__set__('client', mockClient)
      preflightCheckController.__set__('config', mockConfig)

      preflightCheckController.startChecks()
      .catch((err) => {
        expect(err).toBeA(Error)
        done()
      })
    })
  })
})
