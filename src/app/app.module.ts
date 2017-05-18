import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { MaterializeModule } from 'angular2-materialize';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { TradeSectComponent } from './trade-sect/trade-sect.component';
import { HowItWorksComponent } from './how-it-works/how-it-works.component';
import { DemoSectComponent } from './demo-sect/demo-sect.component';
import { AboutPageComponent } from './about-page/about-page.component';
import { ContactPageComponent } from './contact-page/contact-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { SendPageComponent } from './send-page/send-page.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    TradeSectComponent,
    HowItWorksComponent,
    DemoSectComponent,
    AboutPageComponent,
    ContactPageComponent,
    HomePageComponent,
    SendPageComponent,
  ],
  imports: [
    FormsModule, 
    MaterializeModule,       
    BrowserModule,    
    HttpModule,
    RouterModule.forRoot([
      {
        path: 'demo',
        component: DemoSectComponent
      },
      {
        path: '',
        component: HowItWorksComponent//HomePageComponent
      },
      {
        path: 'send',
        component: SendPageComponent
      },
      {
        path: 'about',
        component: AboutPageComponent
      },
      {
        path: 'contact',
        component: ContactPageComponent
      },    
  ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
