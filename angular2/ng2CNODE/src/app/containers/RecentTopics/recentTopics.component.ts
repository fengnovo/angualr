import {Component,Input} from '@angular/core'

import {transTimeFunc} from '../../util/time'

@Component({
  selector: 'recentTopics',
  templateUrl: './recentTopics.component.html',
  styleUrls: ['./recentTopics.component.css']
})
export class RecentTopicsComponent {

  @Input() replies

  constructor() {}

  transTimeFunc(str) {
    return transTimeFunc(str)
  }

}
