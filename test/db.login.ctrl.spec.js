'use strict'

const expect = require('expect')
const rewire = require('rewire')

let Db = rewire('../server/lib/db/login.ctrl')

describe('[Db]', () => {
  describe('(Login.Ctrl)', () => {
    beforeEach(() => { // reset the rewired functions
      let Db = rewire('../server/lib/db/login.ctrl')
    })
    console.log(Db)
    // it('should be able to insert into the db', (done) => {
      const ipAddr = '192.168.10.1'
      const polyId = '123'
      const params = { test: 'test'}

      Db.insertAttempt(ipAddr, polyId, params)
    })




  //   it('should run getinfo and throw an error', (done) => {
  //     Db.navClient = {
  //       getInfo: () => { throw new Exception() },
  //     }
  //     const res = {
  //       send: (response) => {
  //         const jsonResponse = JSON.parse(response)
  //         expect(jsonResponse.type).toBe('FAIL')
  //         expect(jsonResponse.code).toBe('RPC_001')
  //         expect(jsonResponse.status).toBe(200)
  //         expect(jsonResponse.message).toBeA('string')
  //         done()
  //       },
  //     }
  //     const req = {}
  //     Db.getInfo(req, res)
  //   })
  //   it('should run the command with params and succeed', (done) => {
  //     Db.navClient = {
  //       getInfo: () => { return Promise.resolve({ code: 200 }) },
  //     }
  //     const res = {
  //       send: (response) => {
  //         const jsonResponse = JSON.parse(response)
  //         expect(jsonResponse.type).toBe('SUCCESS')
  //         done()
  //       },
  //     }
  //     const req = {}
  //     Db.getInfo(req, res)
    // })
  // })
})
