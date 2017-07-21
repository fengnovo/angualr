import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {RouterModule} from "@angular/router";
import {rootRouterConfig} from "./app.routes";

import { AppComponent } from './app.component';

import { HomeComponent } from './containers/Home';
import { DetailComponent } from './containers/Detail';
import { UserComponent } from './containers/User';
import { LoginComponent } from './containers/Login';
import { PublishComponent } from './containers/Publish';

import { LoadingComponent } from './components/Loading';
import { RecentTopicsComponent } from './containers/RecentTopics';
import { RepliesComponent } from './containers/Replies';


import {FetchDataService} from './services/fetch-data.service';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DetailComponent,
    UserComponent,
    LoginComponent,
    PublishComponent,
    LoadingComponent,
    RecentTopicsComponent,
    RepliesComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(rootRouterConfig)
  ],
  providers: [FetchDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
