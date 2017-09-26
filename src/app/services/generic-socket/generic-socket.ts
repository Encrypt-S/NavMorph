import { Injectable } from '@angular/core'
import { Http, Response } from '@angular/http'

import { Observable } from 'rxjs/Observable'

import * as io from 'socket.io-client'


@Injectable()
export class GenericSocketService {

  private socket

  constructor() { }

  sendMessage(messageType:string , messageContent:string) {
    if(!this.socket) {
      console.log('Err: Socket not setup yet')
      return
    }
    this.socket.emit(messageType, messageContent)
    console.log("MESSAGE SENT", messageContent)
  }

  getMessages(socketUrl, mode) {
    let observable = new Observable(observer => {
      this.socket = io(socketUrl)
      if (mode === 'message' || mode === 'all') {
        this.socket.on('message', (data) => {
          observer.next(data)
        })
      }

      if (mode === 'serverMode' || mode === 'all') {
        this.socket.on('server-mode', (data) => {
          observer.next(data)
        })
      }

      if (mode === 'serverMessages' || mode === 'all') {
        this.socket.on('server-message', (data) => {
          observer.next(data)
        })
      }
      return () => {
        this.socket.disconnect()
      }
    })
    return observable
  }

}
