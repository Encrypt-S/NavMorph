import { Component, OnInit, OnDestroy} from '@angular/core';
import { Observable } from 'rxjs/Observable';

import * as io from 'socket.io-client';

@Component({
  selector: 'test-socket-interface',
  templateUrl: './test-socket-interface.component.html',
  styleUrls: ['./test-socket-interface.component.scss']
})
export class TestSocketInterfaceComponent implements OnInit, OnDestroy {

  private url = 'https://localhost:3000';

  private socket;

  messages: any = [{text: 'sample message'}]
  connection
  message

  constructor() { }

  ngOnInit() {
    this.connection = this.getMessages().subscribe(message => {
      this.messages.push(message);
    })
  }

  ngOnDestroy() {
    this.connection.unsubscribe();
  }

  sendMessage(message) {
    this.socket.emit('add-message', message);
    console.log("MESSAGE SENT", message);
    this.message = '';  
  }

  getMessages() {

    let observable = new Observable(observer => {
      this.socket = io(this.url);
      this.socket.on('message', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      }
    })
    return observable;
  }

}
