<template>
    <div>
        <div id="editorElem" style="text-align:left"></div>
    </div>
</template>

<script>
    import E from 'wangeditor'
    export default {
      name: 'editor',
      data () {
        return {
          editorContent: ''
        }
      },
      methods: {
        clickHandle() {
            // this.props.publishTopic(this.editor.txt.text())
            console.log(this.editor.txt.text())
        }
      },
      mounted() {
        var editor = new E('editorElem')
        console.log(editor)
        editor.config.uploadImgShowBase64 = true
        editor.create()
      }
    }
</script>
