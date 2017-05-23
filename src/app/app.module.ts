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
import { SellingPointsSectComponent } from './selling-points-sect/selling-points-sect.component';
import { DemoSectComponent } from './demo-sect/demo-sect.component';
import { AboutPageComponent } from './about-page/about-page.component';
import { ContactPageComponent } from './contact-page/contact-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { SendPageComponent } from './send-page/send-page.component';
import { HowItWorksComponent } from './how-it-works/how-it-works.component';
import { LegalSectComponent } from './legal-sect/legal-sect.component';
import { PartnersSectComponent } from './partners-sect/partners-sect.component';
import { TileComponentComponent } from './tile-component/tile-component.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    TradeSectComponent,
    SellingPointsSectComponent,
    DemoSectComponent,
    AboutPageComponent,
    ContactPageComponent,
    HomePageComponent,
    SendPageComponent,
    HowItWorksComponent,
    TileComponentComponent,
    LegalSectComponent,
    PartnersSectComponent,
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
        component: HomePageComponent
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
