import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, JsonpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { MaterializeModule } from 'angular2-materialize';
import { QRCodeModule } from 'angular2-qrcode';

import { AppComponent } from './app.component';
import { routes } from './app.routes';

import { DemoPage } from './pages/demo/demo.component';
import { AboutPage } from './pages/about/about.component';
import { HomePage } from './pages/home/home.component';
import { SendPage } from './pages/send/send.component';
import { StatusPage } from './pages/status/status.component';

import { HowItWorksSection } from './sections/how-it-works/how-it-works.component';
import { LegalSection } from './sections/legal/legal.component';
import { PartnersSection } from './sections/partners/partners.component';
import { HeaderSection } from './sections/header/header.component';
import { FooterSection } from './sections/footer/footer.component';
import { SellingPointsSection } from './sections/selling-points/selling-points.component';
import { HeroBannerSection } from './sections/hero-banner/hero-banner.component';

import { TileComponent } from './components/tile/tile.component';
import { StatusComponent } from './components/status/status.component';
import { SendCoinsFormComponent } from './components/send-coins-form/send-coins-form.component';

import { GenericNodeApiService }  from './services/generic-node-api/generic-node-api';
import { ChangellyApiService }  from './services/changelly-api/changelly-api';
import { SendPageDataService } from './services/send-page-data/send-page-data';



@NgModule({
  declarations: [
    AppComponent,
    HomePage,
    SendPage,
    DemoPage,
    AboutPage,
    StatusPage,
    HeaderSection,
    FooterSection,
    SellingPointsSection,
    HowItWorksSection,
    LegalSection,
    PartnersSection,
    TileComponent,
    SendCoinsFormComponent,
    HeroBannerSection,
    StatusComponent,
  ],
  imports: [
    FormsModule,
    QRCodeModule,
    MaterializeModule,
    BrowserModule,
    HttpModule,
    JsonpModule,
    RouterModule.forRoot(routes)
  ],
  providers: [GenericNodeApiService, ChangellyApiService, SendPageDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
