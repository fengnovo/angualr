import {Routes} from "@angular/router";

import { HelloComponent } from './Hello';
import { WTFComponent } from './WTF';
import { HomeComponent } from './Home';


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
    path: 'hello',
    component: HelloComponent
  },
  {
    path: 'wtf',
    component: WTFComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
];
