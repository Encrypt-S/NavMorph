const expect = require('expect')
const rewire = require('rewire')
const sinon = require('sinon')

let statusCtrl = rewire('../src/lib/order/status.ctrl') 
let validator = rewire('../src/lib/options-validator')

describe('[StatusCtrl]', () => {
  describe('(getOrder)', () => {
    beforeEach(() => { // reset the rewired functions
      statusCtrl = rewire('../src/lib/order/status.ctrl')
      validator = rewire('../src/lib/options-validator')
    })
    it('should catch validation errors', (done) => { 

    })
    it('should insertAttempt and send a "blocked" response if ip is blocked', (done) => { 

    })
    it('should check if order exists if the ip isnt blocked', (done) => { 

    })
  })

  describe('(checkOrderExists)', () => {
    beforeEach(() => { // reset the rewired functions
      statusCtrl = rewire('../src/lib/order/status.ctrl')
      validator = rewire('../src/lib/options-validator')
    })
    it('should catch errors', (done) => { 

    }) 
    it('should get the order if the orderId exists', (done) => { 

    })   
    it('should send an empty array response if order doesn\'t exist', (done) => { 

    })
  })

  describe('(getOrderFromDb)', () => {
    beforeEach(() => { // reset the rewired functions
      statusCtrl = rewire('../src/lib/order/status.ctrl')
      validator = rewire('../src/lib/options-validator')
    })
    it('should catch errors', (done) => { 
      //getOrder
      //checkForSuspiciousActivity
      //getEta
    })
    it('should checkForSuspiciousActivity if order doesn\'t exist', (done) => { 

    })
    it('should send empty res if order is abandoned', (done) => { 

    })
    it('should send the order and it\'s eta', (done) => { 

    })
  })

  describe('(checkForSuspiciousActivity)', () => {
    beforeEach(() => { // reset the rewired functions
      statusCtrl = rewire('../src/lib/order/status.ctrl')
      validator = rewire('../src/lib/options-validator')
    })
    it('should catch errors', (done) => { 
      //insertAttempt
      //checkIfSuspicious
      //blackListIp
    })
    it('should blackList if ip is suspicious', (done) => { 

    })
    it('should send empty res if order is abandoned', (done) => { 

    })
    it('should send the order and it\'s eta', (done) => { 

    })
  })

  describe('(updateOrderStatus)', () => {
    beforeEach(() => { // reset the rewired functions
      statusCtrl = rewire('../src/lib/order/status.ctrl')
      validator = rewire('../src/lib/options-validator')
    })
    it('should catch validation errors', (done) => { 

    })
  })

  describe('(abandonOrder)', () => {
    beforeEach(() => { // reset the rewired functions
      statusCtrl = rewire('../src/lib/order/status.ctrl')
      validator = rewire('../src/lib/options-validator')
    })
    it('should catch validation errors', (done) => { 

    })
    it('should ', (done) => { 

    })
  })
})