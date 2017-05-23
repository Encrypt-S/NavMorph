import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { MaterializeModule } from 'angular2-materialize';

import { AppComponent } from './app.component';

import { DemoSectComponent } from './pages/demo/demo.component';
import { AboutPageComponent } from './pages/about/about.component';
import { ContactPageComponent } from './pages/contact/contact.component';
import { HomePageComponent } from './pages/home/home.component';
import { SendPageComponent } from './pages/send/send.component';

import { HowItWorksComponent } from './sections/how-it-works/how-it-works.component';
import { LegalSectComponent } from './sections/legal/legal.component';
import { PartnersSectComponent } from './sections/partners/partners.component';
import { HeaderComponent } from './sections/header/header.component';
import { FooterComponent } from './sections/footer/footer.component';
import { SellingPointsSectComponent } from './sections/selling-points/selling-points.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    SellingPointsSectComponent,
    DemoSectComponent,
    AboutPageComponent,
    ContactPageComponent,
    HomePageComponent,
    SendPageComponent,
    HowItWorksComponent,
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
