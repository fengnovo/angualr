import {Component,ViewChild} from '@angular/core'
import {Router} from '@angular/router'

import { EditorComponent } from '../../components/Editor'
import {FetchDataService} from '../../services/fetch-data.service'
import { toastIt } from '../../components/Toast' 

@Component({
  selector: 'publish',
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.css']
})
export class PublishComponent {

  private user:any = {}
  @ViewChild(EditorComponent) editor: EditorComponent;

  constructor(private _router:Router, private fetchDataService:FetchDataService) {
    let user = JSON.parse(localStorage.getItem('fengnovo.cnode.user')) || {}
    this.user = user
  }

  publishTopic(topicTitle:string) {
    let topicContent = this.editor.clickHandle()

    topicTitle = topicTitle.replace(/^(\s|\u00A0)+/,'').replace(/(\s|\u00A0)+$/,'')
    topicContent = topicContent.replace(/^(\s|\u00A0)+/,'').replace(/(\s|\u00A0)+$/,'')
    if(topicTitle == ''){
        toastIt('请输入标题！', 2000, {fontSize: '18px'})
        return
    }
    if(!topicContent){
        toastIt('请输入内容！', 2000, {fontSize: '18px'})
        return
    }
    this.postTopic(topicTitle, topicContent)
  }

  postTopic(title:string, content:string):void {
        let accesstoken = this.user.accesstoken
        console.log({
            accesstoken,
            title,
            tab: 'dev',
            content
        });

         this.fetchDataService.post(`/api/v1/topics`, {
                accesstoken,// String 用户的 accessToken
                title,// String 标题
                tab: 'dev',
                content// String 主体内容
            })
           .subscribe(json => {
                console.log(json)
                if(json.success){
                    toastIt('成功', 2000, {fontSize: '18px'})
                    setTimeout(()=>{
                        // this.context.router.push(`/#/detail/${json.topic_id}`)
                        this._router.navigate(['/detail/'+json.topic_id])
                    },2000)
                }else{
                    toastIt(json.error_msg, 2000, {fontSize: '18px'})
                }
            })

  }


  handleExit():void {
      localStorage.removeItem('fengnovo.cnode.user')
      this.user = {}
  }

  handleBack():void {
      window.history.back()
  }
  
  PostData(event):void {
    console.log(event) 
  }
}
