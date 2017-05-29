import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { MaterializeModule } from 'angular2-materialize';

import { AppComponent } from './app.component';
import { routes } from './app.routes';

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
import { SendCoinsSection } from './sections/send-coins/send-coins.component';

import { TileComponent } from './components/tile/tile.component';

import { CurrenciesService } from './services/currencies';


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
    TileComponent,
    SendCoinsSection,
  ],
  imports: [
    FormsModule,
    MaterializeModule,
    BrowserModule,
    HttpModule,
    JsonpModule,
    RouterModule.forRoot(routes)
  ],
  providers: [CurrenciesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
