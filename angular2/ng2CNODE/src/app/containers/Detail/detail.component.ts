import {Component,OnInit} from '@angular/core'
import {FetchDataService} from '../../services/fetch-data.service'
import {ActivatedRoute} from '@angular/router'

import {transTimeFunc} from '../../util/time'

@Component({
  selector: 'detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {

  private loadingOpt:any = {r:52, z:4, c:'#65bbce'}
  private id:string = null
  private content:string =''
  private title:string = '详情'
  private replies:any[] = []
  private author:any = {}
  private author_id:string = ''
  private reply_count:number = 0
  private visit_count:number = 0
  private create_at:any = null
  private tab:string = ''

  constructor(private fetchDataService:FetchDataService, private route:ActivatedRoute){
    this.id = route.snapshot.params['id']
  }
  ngOnInit(){
    this.fetchDataService.get(`/api/v1/topic/${this.id}`)
      .subscribe(data => {
        let d = data.data
        this.content = d.content
        this.title = d.title
        this.replies = d.replies
        this.author = d.author
        this.author_id = d.author_id
        this.reply_count = d.reply_count
        this.visit_count = d.visit_count
        this.create_at = d.create_at
        this.tab = d.tab
      })
  }
  transTimeFunc(ts: any): any {
    return transTimeFunc(ts)
  }
  handleBack() {
    window.history.back()
  }

}
