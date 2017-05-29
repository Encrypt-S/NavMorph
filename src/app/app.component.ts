import { Component } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';

import { TitleChangeService } from './services/title-change/title-change';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [TitleChangeService]
})
export class AppComponent {

  constructor (
    private _router: Router,
    private titleChangeService: TitleChangeService ) {
      _router.events.subscribe ( event => {
        if( event instanceof NavigationStart ){
          titleChangeService.updateTitle(event);
        }
      });
    }
}
