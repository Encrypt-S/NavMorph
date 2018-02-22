const expect = require('expect')
const rewire = require('rewire')

let preflightCheckController = rewire('../server/lib/preflightCheckController')


describe('[preflightCheckController]', () => {
  describe('(startChecks)', () => {
    beforeEach(() => { // reset the rewired functions
      preflightCheckController = rewire('../server/lib/preflightCheckController')
    })
    it('should reject errors from the functions it calls', (done) => {
      //client.unlockwallet
      //client.getinfo
      //client.getblockcount
    })

    it('should error if the nav daemon is too far out of sync with the blockchain', (done) => {
      
    })

    it('should return the wallets balance', (done) => {
      
    })
    
  })
})
