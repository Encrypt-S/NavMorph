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
      if (mode === 'MESSAGE' || mode === 'ALL') {
        this.socket.on('MESSAGE', (data) => {
          observer.next(data)
        })
      }
      if (mode === 'SERVERMODE' || mode === 'ALL') {
        this.socket.on('SERVER_MODE', (data) => {
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
