<template>
    <div class="loading">
        <div class="wrap" style={wrap}>
            <div class="circle-layout" :style="wrap">
                <div class="layout-left">
                    <div class="circle-left" :style="ll"></div>
                </div>
                <div class="layout-right">
                    <div class="circle-right" :style="lr"></div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

  export default {
    name: 'loading',
    props: ['r','z','c'],
    data() {
      return {wrap: null,ll: null,lr: null}
    },
    computed: {
			
    },
    
    created() {
        let r = this.r
        let z = this.z
        let c = this.c
        this.wrap = {'width': r+'px','height':r+'px'}
        this.ll = {
            'position': 'absolute',
            'top': 0,
            'left': 0,
            'width': (r-(2*z)) + 'px',
            'height': (r-(2*z)) + 'px',
            'borderWidth': z+'px ',
            'borderStyle': 'solid',
            'borderColor': c,
            'borderRadius': '50%',        
            'borderLeft': z+'px solid transparent',
            'borderBottom': z+'px solid transparent',
            'transform': 'rotate(40deg)',
            'animation': 'animation-circle-left 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        }
        this.lr = {
            'position': 'absolute',
            'top': 0,
            'right': 0,
            'width': (r-(2*z)) + 'px',
            'height': (r-(2*z)) + 'px',
            'borderWidth': z+'px ',
            'borderStyle': 'solid',
            'borderColor': c,
            'borderRadius': '50%',        
            'borderRight': z+'px solid transparent',
            'borderBottom': z+'px solid transparent',
            'transform': 'rotate(-310deg)',
            'animation': 'animation-circle-right 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite',
        }
    }
  }
</script>

<style>
.wrap{
    width: 52px;
    height: 52px;
    animation: animation-wrap 2.5s linear infinite;
}
/*外层布局*/
.circle-layout{
    width: 52px;
    height: 52px;
    animation: animation-circle 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}
/*左div*/
.layout-left{
    float: left;
    width: 50%;
    height: 100%;
    overflow: hidden;
    position: relative;
}
/*右div*/
.layout-right{
    float: right;
    width: 50%;
    height: 100%;
    overflow: hidden;
    position: relative;
}
/*左圈*/
.circle-left{
    /*position: absolute;
    top: 0;
    left: 0;
    width: 44px;
    height: 44px;
    border: 4px solid #F88E8B;
    border-radius: 50%;
    border-left: 4px solid transparent;
    border-bottom: 4px solid transparent;
    transform: rotate(40deg);
    animation: animation-circle-left 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;*/
}
/*右圈*/
.circle-right{
    /*position: absolute;
    top: 0;
    right: 0;
    width: 44px;
    height: 44px;
    border: 4px solid #F88E8B;
    border-radius: 50%;
    border-right: 4px solid transparent;
    border-top: 4px solid transparent;
    transform: rotate(-310deg);
    animation: animation-circle-right 1.5s cubic-bezier(0.4, 0, 0.2, 1) infinite;*/
}
/*左圈动画*/
@keyframes animation-circle-left{
    0%{
        transform: rotate(40deg);
    }
    50%{
        transform: rotate(-100deg);
    }
    100%{
        transform: rotate(40deg);
    }
}
/*右圈动画*/
@keyframes animation-circle-right{
    0%{
        transform: rotate(-310deg);
    }
    50%{
        transform: rotate(-170deg);
    }
    100%{
        transform: rotate(-310deg);
    }
}
/*外层动画*/
@keyframes animation-circle{
    0%{
        transform: rotate(0deg);
    }
    25%{
        transform: rotate(180deg);
    }
    50%{
        transform: rotate(360deg);
    }
    75%{
        transform: rotate(540deg);
    }
    100%{
        transform: rotate(720deg);
    }
}
/*最外层动画*/
@keyframes animation-wrap{
    0%{
        transform: rotate(0deg);
    }
    100%{
        transform: rotate(360deg);
    }
}
</style>

