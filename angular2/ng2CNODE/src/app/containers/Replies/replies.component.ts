import {Component,Input} from '@angular/core'

import {transTimeFunc} from '../../util/time'

@Component({
  selector: 'replies',
  templateUrl: './replies.component.html',
  styleUrls: ['./replies.component.css']
})
export class RepliesComponent {
  @Input() replies

  constructor() {}

  transTimeFunc(str):any {
    return transTimeFunc(str)
  }
}
