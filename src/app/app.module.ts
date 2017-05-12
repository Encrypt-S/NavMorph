import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from '@angular/material';


import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { TradeSectComponent } from './trade-sect/trade-sect.component';
import { ImagesTextComponent } from './images-text/images-text.component';
import { DemoSectComponent } from './demo-sect/demo-sect.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    TradeSectComponent,
    ImagesTextComponent,
    DemoSectComponent,
  ],
  imports: [
    FormsModule,
    BrowserAnimationsModule, // 
    MaterialModule,          // Mat. Design comps
    BrowserModule,
    
    HttpModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
