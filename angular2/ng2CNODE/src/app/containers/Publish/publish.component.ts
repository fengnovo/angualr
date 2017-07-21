import {Component} from '@angular/core';

@Component({
  selector: 'publish',
  templateUrl: './publish.component.html',
  styleUrls: ['./publish.component.css']
})
export class PublishComponent {

  private user:any = {}

  constructor() {
    let user = JSON.parse(localStorage.getItem('fengnovo.cnode.user')) || {}
    this.user = user
  }

  publishTopic(content:string) {
    console.log(content)
  }

  clickHandle(title:string) {
    console.log(title)
  }

  handleExit() {
      localStorage.removeItem('fengnovo.cnode.user')
      this.user = {}
  }

  handleBack() {
      window.history.back()
  }
}
