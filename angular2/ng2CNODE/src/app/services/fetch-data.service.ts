import { Injectable } from '@angular/core';
import { Http,Headers,RequestOptions } from '@angular/http'
import 'rxjs/add/operator/map'

import { gobalUrl } from '../util/commonConfig'

@Injectable()
export class FetchDataService {

  private options:any

  constructor(private http:Http) { 
    let headers = new Headers({ 'Content-Type': 'application/json' })
    this.options = new RequestOptions({ headers: headers })
  }

  get(url:string) {
    return this.http.get(gobalUrl+url)
              .map(res => res.json())
      
  }

  post(url:string,body:any) {
    return this.http.post(gobalUrl+url, JSON.stringify(body), this.options)
              .map(res => res.json())
      
  }

}
