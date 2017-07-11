import { Injectable } from '@angular/core';

import { Title } from '@angular/platform-browser';


@Injectable()
export class TitleChangeService {

  constructor(private titleService: Title) { }

  updateTitle(event) {
    let newTitle = this.getNewTitle(event.url);
    this.titleService.setTitle(newTitle);
  }

  getNewTitle(url: string){
    let newTitle = 'Polymorph - '
    if(url === '/'){
      return newTitle + 'Home';
    }

    newTitle = newTitle + url.slice(1,2).toUpperCase() + url.slice(2)
    newTitle = newTitle.split('/')[0] // This removes any trailing url params e.g. url is status/id/pass
    return newTitle;
  }

  setTitle( string ){
    this.titleService.setTitle(string);
  }

}
