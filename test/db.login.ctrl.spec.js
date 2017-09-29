'use strict'

const expect = require('expect')
const rewire = require('rewire')

let Db = rewire('../server/lib/db/login.ctrl')

describe('[Db]', () => {
  describe('(Login.Ctrl)', () => {
    beforeEach(() => { // reset the rewired functions
      let Db = rewire('../server/lib/db/login.ctrl')
    })
    it('should fail on params', (done) => {
      Db.insertAttempt({ junkParam: '1234' })
        .catch((error) => {
          expect(error).toBe('LGN_001')
          done()
        })
    })
    it('should get correct params and save', (done) => {
      const ipAddress = '192.168.10.1'
      const polymorphId = '123'
      const params = { test: 'test'}

      function mockFailedLoginsModel(paramsToSave) {
        return {
          save: () => {
            expect(paramsToSave.ip_address).toBe(ipAddress)
            expect(paramsToSave.polymorph_id).toBe(polymorphId)
            expect(paramsToSave.params).toBe(JSON.stringify(params))
            expect(paramsToSave.timestamp instanceof Date).toBe(true)
            return Promise.resolve('SUCCESS')
          },
        }
      }

      Db.__set__('FailedLoginsModel', mockFailedLoginsModel)

      Db.insertAttempt({ ipAddress, polymorphId, params })
        .then((data) => {
          expect(data).toBe('SUCCESS')
          done()
        })
    })
    it('should get correct params and fail', (done) => {
      const ipAddress = '192.168.10.1'
      const polymorphId = '123'
      const params = { test: 'test'}

      function mockFailedLoginsModel(paramsToSave) {
        return {
          save: () => {
            expect(paramsToSave.ip_address).toBe(ipAddress)
            expect(paramsToSave.polymorph_id).toBe(polymorphId)
            expect(paramsToSave.params).toBe(JSON.stringify(params))
            expect(paramsToSave.timestamp instanceof Date).toBe(true)
            return Promise.reject(new Error('FAIL'))
          },
        }
      }

      Db.__set__('FailedLoginsModel', mockFailedLoginsModel)

      Db.insertAttempt({ ipAddress, polymorphId, params })
        .then((data) => {
          expect(true).toBe(false)
          done()
        })
        .catch((error) => {
          console.log('error', error)
          expect(error).toBe('FAIL')
          done()
        })
    })
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
