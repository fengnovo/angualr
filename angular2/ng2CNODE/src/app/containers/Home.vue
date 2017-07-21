<template>
    <div id="content">
				<nav class="nav">
					<img class="homepage-left-img" src="https://o4j806krb.qnssl.com/public/images/cnodejs_light.svg"/>
					<router-link v-if="user.loginname" :to="{path: '/user/'+user.loginname}" >
						<img class="homepage-right-img" src="../assets/account.png"/>
					</router-link>
					<router-link v-if="!user.loginname" to="/login">
						<img class="homepage-right-img" src="../assets/account.png"/>
					</router-link>
				</nav>
                <ul id="list">
						<li v-for="(item,key) in list" :key="key">
							<router-link :to="{path: '/user/'+item.author.loginname}">	
								 <img :src="item.author.avatar_url"/>   
								<!-- <img src="../assets/account.png"/>   -->
							</router-link>
							<router-link :to="{path: '/detail/'+item.id}">
								<div class="list-item">
									<p>{{ item.title }}</p>
									 <h5>{{ transTimeFunc(item.create_at) }}</h5> 
								</div>
							</router-link>
						</li>
				</ul>
				 <div class="more-center"><loading r=52 z=4 c='#65bbce'></loading></div> 
				<footer class="footer">
					<ul id="footer-list">
						<li key='all' @click="handleTab('all')" :class="activeClass==='all'? 'active': ''">
								全部
						</li>
						<li key='good' @click="handleTab('good')" :class="activeClass==='good'? 'active': ''">
								精华
						</li>
						<li key='share' @click="handleTab('share')" :class="activeClass==='share'? 'active': ''">
								分享
						</li>
						<li key='ask' @click="handleTab('ask')" :class="activeClass==='ask'? 'active': ''">
								问答
						</li>
						<li key='job' @click="handleTab('job')" :class="activeClass==='job'? 'active': ''">
								招聘 
						</li>
					</ul>
				</footer>
		    </div>
</template>

<script>
	import { transTime } from '@/util/time' 
	import { getScrollTop,getWindowHeight,getScrollHeight } from '@/util/scroll' 
	import { gobalUrl,HomePageLimit } from '@/util/commonConfig' 
	import Loading from '@/components/Loading.vue' 

  export default {
    data() {
		let cnode = JSON.parse(localStorage.getItem('fengnovo.cnode')) || {}
		let user = JSON.parse(localStorage.getItem('fengnovo.cnode.user')) || {}
		let {
			list=[],
			tab='all',
			scrollTop=0,
			activeClass='all',
			page=1
		} = cnode
		return {
			list,
			tab,
			page,
			activeClass,
			scrollTop,
			user,
			loaded: false
		}
    },
    components: {
		Loading	
	},
	
	created() {
		if(this.list.length == 0){
			this.fetchData()
		}
	},

	mounted() {
		if(this.list.length != 0){
			window.scrollTo(0, this.scrollTop)
			this.loaded = true
			this.scollHandle()
		}
	},
	
	methods: {
		handleTab(id) {
			if(window.onscroll) window.onscroll = null
			this.tab = id;
			this.list = [];
			this.page = 1;
			this.activeClass = id;
			setTimeout(()=>{
				this.fetchData()
			},50)
		},
		transTimeFunc(str) {
			return transTime(str)
		},
		scollHandle() {
			let _this = this;
			window.onscroll = function(){
				_this.scrollTop = getScrollTop()
			　　if(_this.loaded && _this.scrollTop + getWindowHeight() == getScrollHeight()){
					_this.loaded = false
					fetch(`${gobalUrl}/api/v1/topics?limit=${HomePageLimit}&page=${_this.page}&tab=${_this.tab}`)
					.then(response=>response.json())
					.then(data=> {
						let page = _this.page+1
						// console.log(page)
						_this.page = page
						_this.list = _this.list.concat(data.data)
						_this.loaded = true
					})
					.catch(e => {
						console.log(e)
						_this.loaded = true
					})
			　　}
			};
		},
		fetchData() {
			fetch(`${gobalUrl}/api/v1/topics?limit=${HomePageLimit}&page=${this.page}&tab=${this.tab}`)
			.then(response=>response.json())
			.then(data=> {
				let page = this.page+1
				this.page = page
				this.list = data.data
				this.scollHandle()
				this.loaded = true
			})
			.catch(e => console.log(e))
		},

	},
	beforeDestroy() {
		if(window.onscroll) window.onscroll = null
		localStorage.setItem('fengnovo.cnode',JSON.stringify({
			scrollTop: this.scrollTop,
			list: this.list,
			tab: this.tab,
			page: this.page,
			activeClass: this.activeClass
		}))
	}
  }
</script>

<style>
.footer{
    width: 100%;
    height: 3rem;
    position: fixed;
    bottom: 0;
    background: -webkit-linear-gradient(top, #65bbce, #50b1c8);
}

#footer-list {
	font-size: 0;
}

#footer-list li{
    text-align: center;
    width: 20%;
    height: 3rem;
    line-height: 3rem;
    font-size: 1rem;
    display: inline-block;
    color: #fff;
    
}
#footer-list li.active{
    text-shadow: 4px 2px 4px #480b0b;
}


</style>

