import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-demo-sect',
  templateUrl: './demo-sect.component.html',
  styleUrls: ['./demo-sect.component.css']
})
export class DemoSectComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  coins = ['Navcoin', 'Bitcoin', 'Litecoin'];
}
