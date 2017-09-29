import { Component, OnInit, OnDestroy} from '@angular/core'
import { Observable } from 'rxjs/Observable'

import * as io from 'socket.io-client'

import { SocketUrl } from '../../services/environment-config'

import { GenericSocketService } from '../../services/generic-socket/generic-socket'

@Component({
  selector: 'test-socket-interface',
  templateUrl: './test-socket-interface.component.html',
  styleUrls: ['./test-socket-interface.component.scss']
})
export class TestSocketInterfaceComponent implements OnInit, OnDestroy {

  private socket

  messages: any = [{text: 'sample message'}]
  connection
  message

  constructor(private genericSocket: GenericSocketService ) {}

  ngOnInit() {
    this.connection = this.genericSocket.getMessages(SocketUrl, 'MESSAGE').subscribe((message) => {
      console.log(message)
      if(this.messages.length > 5) {
        this.messages = []
      }
      this.messages.push(message)
    })
  }

  ngOnDestroy() {
    this.connection.unsubscribe()
  }

  sendMessage(messageType, messageContent) {
    this.genericSocket.sendMessage(messageType, messageContent)
    console.log("MESSAGE SENT", messageContent)
    this.message = ''  
  }

}

