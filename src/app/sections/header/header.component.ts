import { Component, OnInit, EventEmitter, ViewChild } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';

@Component({
  selector: 'header-section',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderSection implements OnInit {

  @ViewChild('HOME') home;
  @ViewChild('SEND') send;
  @ViewChild('ABOUT') about;
  @ViewChild('CONTACT') contact;

  constructor (
    private router: Router ) {
      router.events.subscribe ( event => {

        if( event instanceof NavigationStart ){
          let tab = this.getTabFromUrl(event.url)
          switch (tab){
            case '':
              this.home.nativeElement.click();
              break;
            case 'send':
              this.send.nativeElement.click();
              break;
            case 'about':
              this.about.nativeElement.click();
              break;
            case 'contact':
              this.contact.nativeElement.click();
              break;
          }
        }
      });
    }

    ngOnInit() {
    }

    getTabFromUrl(url){
      let tab = url.split('/')[1]
      return tab
    }
}
