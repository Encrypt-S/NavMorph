import { Injectable } from '@angular/core';

@Injectable()
export class tabIndicatorUpdateService {

  constructor() {
    let tabs = [
      'HOME',
      'SEND',
      'ABOUT',
      'CONTACT',
    ]
   }


  updateTab(event){
    let tab = this.getTab(event.url);

    // $(document).ready(function(){
    //   $('ul.tabs').tabs('select_tab', tab);
    // });
  }

  getTab(url){
    let tab = url.split('/')[1]
    if(tab === ''){
      return 'HOME';
    }

    tab = tab.toUpperCase()

    if(tabs.contains(tab)){
      return tab
    } else {
      throw new Error('Invalid tab name')
    }
  }
}
