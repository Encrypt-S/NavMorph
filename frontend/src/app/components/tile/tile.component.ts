import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'tile-component',
  templateUrl: './tile.component.html',
  styleUrls: ['./tile.component.scss']
})
export class TileComponent implements OnInit {

  @Input() title: string;
  @Input() text: string;
  @Input() buttonText: string;
  @Input() icon: string;
  @Input() theme: string;

  constructor() { }

  ngOnInit() {
  }

}
