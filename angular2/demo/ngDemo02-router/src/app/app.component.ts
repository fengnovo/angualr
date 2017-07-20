import { Component } from '@angular/core';
import {Location} from '@angular/common';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor( private _router: Router, private _location: Location ){}
  title = 'app works!';
  goHello() {
    this._router.navigate(['hello']);
  }
  goWTF() {
    this._router.navigate(['wtf']);
  }
  goBack() {
    this._location.back();
  }
  
}
