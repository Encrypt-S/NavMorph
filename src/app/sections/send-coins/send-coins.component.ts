import { Component, OnInit } from '@angular/core';

import { coinsJson } from './coins-json';

@Component({
  selector: 'send-coins-section',
  templateUrl: './send-coins.component.html',
  styleUrls: ['./send-coins.component.scss']
})
export class SendCoinsSection implements OnInit {

  coins = coinsJson;

  constructor() { }

  ngOnInit() {
  }

}
