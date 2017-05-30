import { Component, OnInit , EventEmitter, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from "@angular/common";

@Component({
  selector: 'header-section',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: [Location]
})
export class HeaderSection implements OnInit  {

  @ViewChild('HOME') home;
  @ViewChild('SEND') send;
  @ViewChild('ABOUT') about;

  constructor (
    private router: Router,
    private location: Location) {

    }

    ngOnInit() {
      this.router.events.subscribe ( event => {
        if( event instanceof NavigationEnd ){
          this.clickTab(this.getTabFromUrl(window.location.pathname))
        }
      });
    }

    getTabFromUrl(url){
      let tab = url.split('/')[1]
      return tab
    }

    clickTab(tab){
      switch (tab) {
        case '':
          setTimeout(() => this.home.nativeElement.click(), 100)
          break
        case 'send':
          setTimeout(() => this.send.nativeElement.click(), 100)
          break
        case 'about':
          setTimeout(() => this.about.nativeElement.click(), 100)
          break
      }
    }
}
