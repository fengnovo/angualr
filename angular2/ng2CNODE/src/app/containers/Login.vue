<template>
    <div id="login">
        <nav class="nav">
            <img class="btn-back" src="../assets/back.png" @click="handleBack"/>
            <div class="nav-text">{{ title }}</div>
        </nav>
        <form class="login-from">
            <input ref="token" type="text" class="login-text" placeholder="请输入Access Token"/>
            <button class="login-btn" @click="fetchData">登录</button>
        </form>
    </div>
</template>

<script>
  import { toastIt } from '@/components/Toast' 
  import { gobalUrl,HomePageLimit } from '@/util/commonConfig' 

  export default {
    data() {
      return {
        title: '登录'
      }
    },
    
    created() {
        let data = localStorage.getItem('fengnovo.cnode.user')
        console.log(data)
		if(data){
            data = JSON.parse(data)
        }
    },
    
    methods: {
        handleBack() {
            window.history.back()
        },
        fetchData() {
            let accesstoken = this.$refs.token.value.replace(/^(\s|\u00A0)+/,'').replace(/(\s|\u00A0)+$/,'')
            console.log(accesstoken)
            if(!accesstoken){
                toastIt('请输入accesstoken！', 2000, {fontSize: '18px'})
                return
            }
            fetch(`${gobalUrl}/api/v1/accesstoken`, {
                method: 'post',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ accesstoken })
            })
            .then(response=>response.json())
            .then(data=> {
                if(data.success){
                    data.accesstoken = accesstoken
                    localStorage.setItem('fengnovo.cnode.user',JSON.stringify(data))
                    
                    this.$router.push({path: '/user/'+data.loginname})
                }else{
                    toastIt(`登录失败！${data.error_msg}`, 2000, {fontSize: '18px'})
                }
            })
            .catch(e => {
                console.log(e)
            })
        }

    },
    beforeDestroy() {
        
    }
  }
</script>

<style>

#login .login-from{
    display: block;
    margin-top: 3.3rem;
    width: 100%;
    height: 100%;
}

#login .login-text{
    display: block;
    margin: 10rem auto 0;
    width: 90%;
    height: 2.6rem;
    font-size: 1.2rem;
    border-radius: .5rem;
    border: 1px solid #ccc;
}

#login .login-btn{
    display: block;
    margin: 2rem auto 0;
    background: #65bbce;
    color: #fff;
    font-size: 1.2rem;
    width: 5rem;
    height: 2.6rem;
    border-radius: .5rem;
    border: none;
}


</style>

