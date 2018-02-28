import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'
import * as io from 'socket.io-client'

import * as  config from '../../services/config'

@Injectable()
export class GenericSocketService {

  private socket = io(config.socketsUrl)

  constructor() {
  }

  sendMessage(messageType:string , messageContent:string) {
    if(!this.socket) {
      console.log('Err: Socket not setup yet')
      return
    }
    this.socket.emit(messageType, messageContent)
    console.log("MESSAGE SENT", messageContent)
  }

  getMessages(mode) {
    let observable = new Observable(observer => {
      if (mode === 'MESSAGE' || mode === 'ALL') {
        this.socket.on('MESSAGE', (data) => {
          observer.next(data)
        })
      }
      if (mode === 'SERVER_MODE' || mode === 'ALL') {
        this.socket.on('SERVER_MODE', (data) => {
          observer.next(data)
        })
      }

      if (mode === 'SERVER_MESSAGES' || mode === 'ALL') {
        this.socket.on('SERVER_MESSAGE', (data) => {
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
