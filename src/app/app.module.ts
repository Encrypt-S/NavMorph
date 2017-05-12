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
import { ButtonsSectComponent } from './buttons-sect/buttons-sect.component';
import { ImagesTextComponent } from './images-text/images-text.component';
import { HeadersTextComponent } from './headers-text/headers-text.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    TradeSectComponent,
    ButtonsSectComponent,
    ImagesTextComponent,
    HeadersTextComponent,
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
