import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'
import * as io from 'socket.io-client'

import * as config from '../../services/config'

@Injectable()
export class GenericSocketService {
  private socket
  public serverMode$: Observable<string>
  public maintenceMode$: Observable<boolean>

  constructor() {
    this.socket = io(config.socketsUrl)
    this.serverMode$ = Observable.fromEvent(this.socket, 'SERVER_MODE')
    this.maintenceMode$ = this.serverMode$.map(value => value === 'MAINTENANCE').startWith(true)
  }

  sendMessage(messageType: string, messageContent: string) {
    if (!this.socket) {
      console.log('Err: Socket not setup yet')
      return
    }
    this.socket.emit(messageType, messageContent)
  }

  getMessages(mode) {
    const observable = new Observable(observer => {
      if (mode === 'MESSAGE' || mode === 'ALL') {
        this.socket.on('MESSAGE', data => {
          observer.next(data)
        })
      }
      if (mode === 'SERVER_MODE' || mode === 'ALL') {
        this.socket.on('SERVER_MODE', data => {
          observer.next(data)
        })
      }

      if (mode === 'SERVER_MESSAGES' || mode === 'ALL') {
        this.socket.on('SERVER_MESSAGE', data => {
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
