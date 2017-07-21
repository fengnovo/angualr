import {Routes} from "@angular/router";

import { HomeComponent } from './containers/Home';
import { DetailComponent } from './containers/Detail';
import { UserComponent } from './containers/User';
import { LoginComponent } from './containers/Login';
import { PublishComponent } from './containers/Publish';


export const rootRouterConfig: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'detail/:id',
    component: DetailComponent
  },
  {
    path: 'user/:id',
    component: UserComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'publish',
    component: PublishComponent
  }
  // {
  //   path: 'hello',
  //   component: HelloComponent
  // },
  // {
  //   path: 'wtf',
  //   component: WTFComponent
  // },
];

