import {Injectable} from '@angular/core';
import {Http,RequestOptions} from '@angular/http';
import 'rxjs/Rx';

@Injectable()
export class MyHttp {
  public restServer;
  public http;

  constructor(Http:Http) {
    this.http = Http;
    this.restServer = 'https://cnodejs.org'
  }

  public get(url, params?:Object, cb?:Function) {
    console.log('开始请求')
    var searchParams = '';
    if (params) {
      for (var key in params) {
        searchParams += key + '=' + params[key] + '&';
      }
    }
    
    this.http.get(this.restServer + url, {
        search: searchParams
      })
      .map(res => res.json())
      .subscribe(data => {
        console.log('请求结束', data)
        cb(data)
      });
  }


}