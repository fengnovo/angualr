import {Component} from '@angular/core'
import {Router} from '@angular/router'

import {FetchDataService} from '../../services/fetch-data.service'
import { toastIt } from '../../components/Toast' 

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  private title:string = '登录'
  private token:string = ''

  constructor(private _router:Router, private fetchDataService:FetchDataService){
    let data:any = localStorage.getItem('fengnovo.cnode.user')
		if(data){
      data = JSON.parse(data)
    }
  }

  handleBack():void {
     window.history.back()
  }

  fetchData(val:string) {
    let accesstoken:string = val.replace(/^(\s|\u00A0)+/,'').replace(/(\s|\u00A0)+$/,'')
    if(accesstoken === ''){
        toastIt('请输入accesstoken！', 2000, {fontSize: '18px'})
        return
    }
    
    this.fetchDataService.post(`/api/v1/accesstoken`, {accesstoken})
           .subscribe(data => {
              if(data.success){
                  data.accesstoken = accesstoken
                  localStorage.setItem('fengnovo.cnode.user',JSON.stringify(data))
                  this._router.navigate(['/user/'+data.loginname]);
              }else{
                  toastIt(`登录失败！${data.error_msg}`, 2000, {fontSize: '18px'})
              }
          })
  }
}
