import {Component,OnInit} from '@angular/core'
import {ActivatedRoute,Router} from '@angular/router'

import {FetchDataService} from '../../services/fetch-data.service'

import {transTimeFunc} from '../../util/time'

@Component({
  selector: 'user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  private loadingOpt:any = {r:52, z:4, c:'#65bbce'}
  private id:string = ''
  private user:any = {}
  private loginname:string = ''
  private title:string = '人物'
  private avatar_url:string = ''
  private githubUsername:string = ''
  private create_at:any = ''
  private score:number = 0
  private recent_topics:any[] = []
  private recent_replies:any[] = []

  constructor(private _router:Router, private fetchDataService:FetchDataService, private route:ActivatedRoute){
    let user:any = JSON.parse(localStorage.getItem('fengnovo.cnode.user')) || {}
    this.id = route.snapshot.params['id']
    this.user = user
  }

  handleBack():void {
    window.history.back()
  }
  
  transTimeFunc(str):any {
    return transTimeFunc(str)
  }

  handlePublish():void {
    if(this.user.loginname){
        this._router.navigate(['/publish'])
    }else{
        this._router.navigate(['/login'])
    }
  }

  handleExit():void {
    localStorage.removeItem('fengnovo.cnode.user')
    this.user = {}
  }


  ngOnInit() {
    this.fetchDataService.get(`/api/v1/user/${this.id}`)
        .subscribe(data=> {
            let d = data.data
            this.title = d.title
            this.loginname = d.loginname
            this.avatar_url = d.avatar_url
            this.githubUsername = d.githubUsername
            this.create_at = d.create_at
            this.score = d.score
            this.recent_topics = d.recent_topics
            this.recent_replies = d.recent_replies
        })
  }
  

}
