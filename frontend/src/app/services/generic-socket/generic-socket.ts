import { Injectable } from '@angular/core'

import { Observable } from 'rxjs/Observable'
import { BehaviorSubject } from 'rxjs/BehaviorSubject'
import * as io from 'socket.io-client'

import * as config from '../../services/config'

@Injectable()
export class GenericSocketService {
  private socket
  public serverMode$: BehaviorSubject<string>
  public maintenanceModeLast$: Observable<boolean>

  constructor() {
    this.socket = io(config.socketsUrl)
    this.serverMode$ = new BehaviorSubject('MAINTENANCE')
    this.maintenanceModeLast$ = this.serverMode$.map(val => val === 'MAINTENANCE')
    this.socket.on('SERVER_MODE', data => {
      this.serverMode$.next(data)
    })
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
