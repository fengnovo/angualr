<template>
    <div>
        <nav class="nav">
            <img class="btn-back" src="../assets/back.png" @click="handleBack"/>
            <div class="nav-text">{{ loginname }}</div>
            <img v-if="user.loginname == loginname" class="nav-img" src="../assets/exit.png" @click="handleExit"/>
            <img v-if="user.loginname != loginname" class="nav-img" src="../assets/write.png" @click="handlePublish"/>
        </nav>
        <div v-if="create_at" id="user">
            <li>
                <div>
                    <img :src="avatar_url"/>
                    <button v-if="user.loginname == loginname" class="login-btn" @click="handlePublish">发表</button> 
                </div>
                <div class="list-item">
                    <p>{{ loginname }}</p>
                    <h5>作者：{{ loginname }} 时间：{{ transTimeFunc(create_at) }}</h5>
                    <h5>分数：{{ score }}</h5>
                </div>
            </li>
            <h3 class="user-topic-list">最近创建的话题</h3>
              <recentTopics :replies="recent_topics"/>  
            <h3 class="user-topic-list">最近参与的话题</h3>
              <recentTopics :replies="recent_replies"/>  
        </div> 
        <div v-if="!create_at" class="content-center">
            <loading r=52 z=4 c='#65bbce'></loading>
        </div> 
    </div>
</template>

<script>
	import { transTime } from '@/util/time' 
    import { gobalUrl,HomePageLimit } from '@/util/commonConfig' 
    import Loading from '@/components/Loading.vue' 
    import RecentTopics from '@/containers/RecentTopics.vue' 
  export default {
    data() {
      let user = JSON.parse(localStorage.getItem('fengnovo.cnode.user')) || {}
      return {
        title: '人物',
        loginname: '',
        avatar_url: '',
        githubUsername: '',
        create_at: null,
        score: 0,
        recent_topics: [],
        recent_replies: [],
        user
      }
    },
    components: {
        Loading,
        RecentTopics	
	},
    
    created() {
        if( this.$route && this.$route.params && this.$route.params.id){
            this.loginname = this.$route.params.id; 
        }
        fetch(`${gobalUrl}/api/v1/user/${this.loginname}`)
		.then(response=>response.json())
		.then(data=> {
            let d = data.data;
            this.title = d.title;
            this.loginname = d.loginname;
            this.avatar_url = d.avatar_url;
            this.githubUsername = d.githubUsername;
            this.create_at = d.create_at;
            this.score = d.score;
            this.recent_topics = d.recent_topics;
            this.recent_replies = d.recent_replies;
            // this.user = d.user;
            // console.log(d)
		})
		.catch(e => {
            console.log(e)
        })
    },
    
    methods: {
        handleBack() {
            window.history.back()
        },
        transTimeFunc(str) {
            return transTime(str)
        },
        handlePublish() {
            if(this.user.loginname){
                this.$router.push({path: '/publish'})
            }else{
                this.$router.push({path: '/login'})
            }
        },
        handleExit() {
            localStorage.removeItem('fengnovo.cnode.user')
            this.user = {}
        }

    },
    beforeDestroy() {
        
    }
  }
</script>

<style>

#user {
    margin-top: 3.3rem;
    margin-bottom: 3rem;
}

#user li{
    padding: .5rem; 
    border-bottom: 1px solid #ccc;
    word-wrap: break-word;
}

#user li img{
    width: 10rem;
    height: 8rem;
}

#user .list-item{
    padding: .5rem; 
    min-height: 4.4rem;
}
#user .list-item p{
    margin: 0;
    margin-bottom: .5rem;
    padding: 0;
    font-size: 1.1rem;
    font-weight: normal; 
    word-wrap: break-word;
    word-break: break-all;
}

#user .list-item h5{
    margin: 0;
    padding: 0;
    font-size: .8rem;
    font-weight: normal; 
}

#user .user-topic-list {
    border-bottom: 1px solid #ccc;
    color: #65bbce;
    /*text-shadow: 4px 2px 4px #480b0b;*/
}

#user .login-btn{
    display: inline-block;
    margin: 1rem 1rem 0;
    background: #65bbce;
    color: #fff;
    font-size: 1.2rem;
    text-align: center;
    line-height: 2.6rem;
    width: 7rem;
    height: 2.6rem;
    border-radius: .5rem;
    border: none;
    vertical-align: top;
}

#user a:link { 
    color:#000; 
    text-decoration:none; 
} 
#user a:visited { 
    color:#b2b2b2; 
    text-decoration:none; 
} 
#user a:hover { 
    color:#000; 
    text-decoration: none; 
} 
#user a:active { 
    color:#b2b2b2; 
    text-decoration:none; 
} 



</style>

