import {Component, ElementRef, Renderer } from '@angular/core'
// import { E } from '../../../../node_modules/wangeditor/release/wangEditor.js'
// import * as wangEditor  from 'wangeditor'
import * as wangEditor from '../../../../node_modules/wangeditor/release/wangEditor.js'

// console.log(window)
console.log(wangEditor)

@Component({
  selector: 'editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent {

  private editorContent:string = ''
  private editor:any

  constructor(el: ElementRef,renderer: Renderer) {
    // let editor = new E('editorElem')
    // console.log(editor)
    // editor.config.uploadImgShowBase64 = true
    // editor.create()
    console.log( el.nativeElement.innerHTHML)
    
    console.log( el.nativeElement)


    var editor = new wangEditor(el.nativeElement)
    // console.log(editor)
    // editor.config.uploadImgShowBase64 = true
    editor.create()
  }

  // ngOnInit() {
  //   console.log('ss' )
  //   console.log( this.el.nativeElement.querySelector('editor'))
  // }

  clickHandle() {
      // this.props.publishTopic(this.editor.txt.text())
    // console.log(this.editor.txt.text())
  }


}
