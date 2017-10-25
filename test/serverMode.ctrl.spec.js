'use strict'

const expect = require('expect')
const rewire = require('rewire')
const sinon = require('sinon')
const mongoose = require('mongoose')

let sandbox
let ServerModeCtrl = rewire('../server/lib/db/serverMode.ctrl')
let ServerModeModel = require('../server/lib/db/serverMode.model')
let ServerMessageModel = require('../server/lib/db/serverMessage.model')


describe('[ServerModeCtrl]', () => {
  describe('(checkMode)', () => {
    beforeEach(() => { // reset the rewired functions
      ServerModeCtrl = rewire('../server/lib/db/serverMode.ctrl')
    })
    it('should check the server mode', (done) => {
      const serverMode = 'SERVER_ON'
      const mockModel = {
        find: () => {},
        select: () => {},
        exec: () => {
          return new Promise((ful) => { ful(serverMode) })
        },
      }
      ServerModeCtrl.__set__('ServerModeModel', mockModel)
      ServerModeCtrl.checkMode()
      .then((mode) => {
        expect(mode).toBe(serverMode)
        done()
      })
    })
  })

  it('should catch rejected errors', (done) => {
    const mockErr = 'REJECT'
    const mockModel = {
      find: () => {},
      select: () => {},
      exec: () => {
        return new Promise((ful, rej) => rej(mockErr))
      },
    }
    ServerModeCtrl.__set__('ServerModeModel', mockModel)
    ServerModeCtrl.checkMode()
    .catch((err) => {
      expect(err).toBe(mockErr)
      done()
    })
  })

  describe('(checkMode)', () => {
    beforeEach(() => { // reset the rewired functions
      ServerModeCtrl = rewire('../server/lib/db/serverMode.ctrl')
    })
    it('should check the server mode', (done) => {
      const serverMode = 'SERVER_ON'
      const mockModel = {
        find: () => {},
        exec: () => {
          return new Promise((ful) => { ful(serverMode) })
        },
      }
      ServerModeCtrl.__set__('ServerMessageModel', mockModel)
      ServerModeCtrl.checkMessage()
      .then((mode) => {
        expect(mode).toBe(serverMode)
        done()
      })
    })
  })

  it('should catch rejected errors', (done) => {
    const mockErr = 'REJECT'
    const mockModel = {
      find: () => {},
      select: () => {},
      exec: () => {
        return new Promise((ful, rej) => rej(mockErr))
      },
    }
    ServerModeCtrl.__set__('ServerMessageModel', mockModel)
    ServerModeCtrl.checkMessage()
    .catch((err) => {
      expect(err).toBe(mockErr)
      done()
    })
  })
})
