import {Component,OnInit,NgZone} from '@angular/core';
import {FetchDataService} from '../../services/fetch-data.service'
import {transTimeFunc} from '../../util/time'
import { getScrollTop,getWindowHeight,getScrollHeight } from '../../util/scroll' 


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{
  private list:any[] = []
  private tab:string = 'all'
  private scrollTop:number = 0
  private activeClass:string = 'all'
  private page:number = 1
  private user:any = {}
  private loaded:boolean = false 

  private loadingOpt:any = {r:52, z:4, c:'#65bbce'};
  
  constructor(private fetchDataService:FetchDataService, private zone:NgZone) {
    let cnode = JSON.parse(localStorage.getItem('fengnovo.cnode')) || {}
		let user = JSON.parse(localStorage.getItem('fengnovo.cnode.user')) || {}
		let {
			list=[],
			tab='all',
			scrollTop=0,
			activeClass='all',
			page=1
		} = cnode
		this.user = user
  }

  ngOnInit(){
    this.fetchDataService.get(`/api/v1/topics?page=1&tab=${this.tab}&limit=10`)
      .subscribe(data => {
        let page = this.page+1
        this.page = page
        this.list = data.data
        
        this.zone.run(() => {
            this.loaded = true
            this.scollHandle()
        });
      })
  }

  handleTab(tabId: string):void {
    this.tab = tabId
    this.activeClass = tabId
    this.list = []
    this.scrollTop = 0
    this.page = 1
    this.fetchDataService.get(`/api/v1/topics?page=1&tab=${this.tab}&limit=10`)
      .subscribe(data => {
        let page = this.page+1
        this.page = page
        this.list = data.data
        
        this.zone.run(() => {
            this.loaded = true
        });
      })
  }

  transTimeFunc(ts: any): any {
    return transTimeFunc(ts)
  }

  scollHandle():void {
    window.onscroll = () => {
      this.scrollTop = getScrollTop()
    　　if(this.loaded && this.scrollTop + getWindowHeight() == getScrollHeight()){
        this.loaded = false
        this.fetchDataService.get(`/api/v1/topics?page=${this.page}&tab=${this.tab}&limit=10`)
              .subscribe(data=> {
                let page = this.page+1
                this.page = page
                this.list = this.list.concat(data.data)
                this.zone.run(() => {
                    this.loaded = true
                });
              })
    　　}
    }
  }

}
