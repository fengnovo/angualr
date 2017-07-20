import {Component} from '@angular/core';
import {Http} from '@angular/http';

import 'rxjs/add/operator/map';
import { TopicListItem } from '../Common/TopicListItem'
import {MyHttp} from '../Common/cnodelist.service';


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [MyHttp]
})
export class HomeComponent {
  title = '测试'
  topicList = []
  public page:number = 1
  constructor(public myHttp:MyHttp) {}

  ngOnInit() {
    this.fetchData()
  }

  fetchData() {
    this.myHttp.get('/api/v1/topics', {
      page: this.page,      //Number 页数
      tab: 'ask',           //String 主题分类。目前有 ask share job good
      limit: 10             //Number 每一页的主题数量
    }, data => {
      this.page++
      console.log('结果', data)
      this.topicList = this.topicList.concat(data.data)
    });
  }

  getMore() {
    this.fetchData()
  }
}


