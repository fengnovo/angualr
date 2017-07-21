import {Component, ElementRef, Input, Renderer } from '@angular/core'
import E from 'wangeditor'

@Component({
  selector: 'editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent {

  private editorContent:string = ''
  private editor:any

  constructor(el: ElementRef, renderer: Renderer) {
    let editor = new E('editorElem')
    console.log(editor)
    editor.config.uploadImgShowBase64 = true
    editor.create()
  }

  clickHandle() {
      // this.props.publishTopic(this.editor.txt.text())
    console.log(this.editor.txt.text())
  }


}
