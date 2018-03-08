import { Component } from '@angular/core'
import { Router, NavigationStart } from '@angular/router'

import { TitleChangeService } from './services/title-change/title-change'
import { SendPageDataService } from './services/send-page-data/send-page-data'
import { ServerMessageDisplayComponent } from './components/server-message-display/server-message-display.component'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [TitleChangeService],
})
export class AppComponent {
  previousUrl: string

  constructor(
    private _router: Router,
    private titleChangeService: TitleChangeService,
    private sendDataServ: SendPageDataService
  ) {
    _router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        scroll(0, 0)
        titleChangeService.updateTitle(event)
        this.sendDataServ.previousPageUrl = _router.url
      }
    })
  }
}
