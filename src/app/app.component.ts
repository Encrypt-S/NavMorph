import { Component } from '@angular/core'
import { Router, NavigationStart } from '@angular/router'

import { ServerMessageDisplayComponent } from './components/server-message-display/server-message-display.component'
import { TitleChangeService } from './services/title-change/title-change'

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
          scroll(0,0)
          titleChangeService.updateTitle(event)
        }
      })
    }
}
