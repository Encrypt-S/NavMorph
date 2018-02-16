import { Component, OnInit, OnDestroy } from '@angular/core'
import { GenericSocketService } from '../../services/generic-socket/generic-socket'
import { ServerMessageModel } from './server-message-model'
import * as io from 'socket.io-client'

@Component({
  selector: 'server-message-display',
  templateUrl: './server-message-display.component.html',
  styleUrls: ['./server-message-display.component.scss']
})
export class ServerMessageDisplayComponent implements OnInit {

  private socketUrl = 'https://localhost:8080'
  connection
  displayMessage: boolean = false
  serverMessage: string
  modeInfo: boolean
  modeWarn: boolean
  modeError: boolean

  constructor(private genericSocket: GenericSocketService) { }

  ngOnInit() {
    this.connectToSocket()
  }

 ngOnDestroy() {
    this.connection.unsubscribe()
  }

  connectToSocket():void {
    this.connection = this.genericSocket.getMessages(this.socketUrl, 'SERVER_MESSAGES')
    .subscribe((serverMessage:ServerMessageModel) => {
      if(Object.keys(serverMessage).length > 0) {
        this.displayMessage = serverMessage.showMessage
        this.serverMessage = serverMessage.serverMessage
        this.setMode(serverMessage.serverMessageType)
        }
      })
    }

    setMode(mode: String) {
      this.modeError = false
      this.modeWarn = false
      this.modeInfo = false
      if (mode === 'INFO') {
        this.modeInfo = true
      } else if(mode === 'WARN') {
        this.modeWarn = true
      } else if(mode === 'ERROR') {
        this.modeError = true
      }
    }
  }

