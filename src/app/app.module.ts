import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { MaterializeModule } from 'angular2-materialize';

import { AppComponent } from './app.component';

import { DemoPage } from './pages/demo/demo.component';
import { AboutPage } from './pages/about/about.component';
import { ContactPage } from './pages/contact/contact.component';
import { HomePage } from './pages/home/home.component';
import { SendPage } from './pages/send/send.component';

import { HowItWorksSection } from './sections/how-it-works/how-it-works.component';
import { LegalSection } from './sections/legal/legal.component';
import { PartnersSection } from './sections/partners/partners.component';
import { HeaderSection } from './sections/header/header.component';
import { FooterSection } from './sections/footer/footer.component';
import { SellingPointsSection } from './sections/selling-points/selling-points.component';

@NgModule({
  declarations: [
    AppComponent,
    HomePage,
    SendPage,
    DemoPage,
    AboutPage,
    ContactPage,
    HeaderSection,
    FooterSection,
    SellingPointsSection,
    HowItWorksSection,
    LegalSection,
    PartnersSection,
  ],
  imports: [
    FormsModule,
    MaterializeModule,
    BrowserModule,
    HttpModule,
    RouterModule.forRoot([
      {
        path: 'demo',
        component: DemoPage
      },
      {
        path: '',
        component: HomePage
      },
      {
        path: 'send',
        component: SendPage
      },
      {
        path: 'about',
        component: AboutPage
      },
      {
        path: 'contact',
        component: ContactPage
      },
  ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
