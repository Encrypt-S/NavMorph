import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'how-it-works-section',
  templateUrl: './how-it-works.component.html',
  styleUrls: ['./how-it-works.component.scss']
})
export class HowItWorksSection implements OnInit {

  @Input('showButton')
  showButton: boolean = true;
  constructor() { }

  ngOnInit() {
  }

}
