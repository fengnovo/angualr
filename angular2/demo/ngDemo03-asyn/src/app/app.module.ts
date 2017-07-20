import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {RouterModule} from "@angular/router";
import {rootRouterConfig} from "./app.routes";

import { AppComponent } from './app.component';
import { HelloComponent } from './Hello';
import { WTFComponent } from './WTF';
import { HomeComponent } from './Home';

@NgModule({
  declarations: [
    AppComponent,
    HelloComponent,
    WTFComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(rootRouterConfig)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
