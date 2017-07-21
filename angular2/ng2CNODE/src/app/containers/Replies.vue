<template>
    <div>
        <img class="comment-icon" src="../assets/commen.png" />
        <span class="comment-text">以下是精彩评论</span>
        <ul id="replie-img">
            <li v-for="(item,i) in replies" :key="i">
                <div class="left-avatar">
                    <router-link :to="{path: '/user/'+item.author.loginname}">
                        <img :src="item.author.avatar_url"/>
                    </router-link>
                    <span class="loginname-avatar">{{ item.author.loginname }}</span>
                </div>
                <div class="list-item">
                    <p v-html="item.content"></p>
                    <h5>{{ transTimeFunc(item.create_at) }}</h5>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
	import { transTime } from '@/util/time' 
    import { gobalUrl,HomePageLimit } from '@/util/commonConfig' 

  export default {
    props: {
        replies:{
            type: Array,    // 类型(原生构造器：String, Number, Boolean, Function, Object, Array)
            required: true, // 是否必须项
            default: [],   
        } 
    },
    
    methods: {
        transTimeFunc(str) {
            return transTime(str)
        },

    }
  }
</script>

<style>
#detail{
    margin: 0;
    padding: .5rem;
    margin-top: 3.3rem;
    word-wrap: break-word;
    word-break: break-all;
}
#detail pre{
    font-size: 14px;
    border-radius: 0;
    padding: 0 15px;
    border: none;
    border-width: 1px 0;
    background: #f7f7f7;
    -o-tab-size: 4;
    -moz-tab-size: 4;
    tab-size: 4;
    word-break: break-all;
    word-wrap: break-word;
    white-space: pre-wrap;
}


#detail img {
    max-width: 100%;
}

#detail .comment-icon {
    width: 2rem;
    height: 2rem;
    vertical-align: top;
    margin-right: .5rem;
}

#detail .comment-text{
    color: #65bbce;
    font-size: 1.2rem; 
    vertical-align: top;
    text-decoration: underline;
}

#detail li{
    padding: .5rem; 
    border-bottom: 1px solid #ccc;
    word-wrap: break-word;
}

#detail li img {
    float: left;
    width: 3.5rem;
    height: 3.5rem;
    border-radius: 50%;
}

#replie-img .left-avatar{
    float: left;
    width: 3.5rem;
}

#replie-img .loginname-avatar{
    font-size: .8rem;
}
#replie-img li:last-child {
    border-bottom: none;
}

#detail .list-item{
    padding: .5rem; 
    margin-left: 3.5rem; 
    min-height: 4.4rem;
}
#detail .list-item p{
    margin: 0;
    margin-bottom: .5rem;
    padding: 0;
    font-size: 1.1rem;
    font-weight: normal; 
    word-wrap: break-word;
    word-break: break-all;
}

#detail .list-item h5{
    margin: 0;
    padding: 0;
    font-size: .8rem;
    font-weight: normal; 
}

</style>

