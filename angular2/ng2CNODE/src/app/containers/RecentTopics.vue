<template>
    <ul id="replie-img">
        <li v-for="(item,i) in replies" :key="i">
            <router-link :to="{path: '/detail/'+item.id}">
                <div class="list-item">
                    <p>{{ item.title }}</p>
                    <h5>{{ transTimeFunc(item.last_reply_at) }}</h5>
                </div>
            </router-link>
        </li>
    </ul>
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

</style>

