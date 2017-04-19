!(function() {
	'use strict';
	App.NavigationCtrl = function($scope, $http, $routeParams) {
		$scope.page = 0;

		$scope.selectPage = function(page, animate){
			$scope.page = page;
			if(animate == null){
				animate = true;
			}
			setTransform(-page * swipeviewWidth, animate);
		}
		var moveRight = false;
		var swipeview = $('#swipeview');
		var swipeviewWidth = swipeview.width();
		var setTransform = function(translate, animate){
			var el = swipeview.get(0);
			if(animate){
				el.style.webkitTransition = '-webkit-transform .3s';
			}
			el.style.webkitTransform = 'translate3d('+translate+'px,0,0)';
		};
		var initEvent = function(){
			var last = 0, base=0;
			var el = swipeview.get(0);
			el.addEventListener('touchend', onend, false);
			el.addEventListener('touchstart', onstart, false);
			el.addEventListener('touchmove', onmove, false);
			el.addEventListener('touchcancel', onend, false);
			
			
			var width = swipeviewWidth, half = width/2, translate;
			function onend(evt) {
				
				//first page
				var page = 0;
				if (translate > half) {
					translate = width;
					page = -1;
				} else if (translate < -half) {
					translate = -width;
					page = 1;
				} else {
					translate = 0;
				}
				if(!moveRight && page == 1){
					translate = 0;
					page = 0;
				}
				$scope.$apply(function() {
					$scope.page = page;
				});
				el.style.webkitTransition = '-webkit-transform .3s';
				setTransform(translate);
				// el.style.webkitTransform = 'translate3d('+translate+'px,0,0)';
			}
				
			function onstart(evt) {
				last = evt.touches[0].pageX;
				var matrix = new WebKitCSSMatrix(getComputedStyle(el).webkitTransform);
				//现有translateX值
				base = matrix.e;
				el.style.webkitTransition = 'none';
			}
			
			function onmove(evt) {
				if (evt.touches.length == 0) return;
				
				var touch = evt.touches[0];
					
				var move = touch.pageX - last;
				if (move !== 0) {
					var v = base + move;
					translate = v;
					setTransform(translate)
					// el.style.webkitTransform = 'translate3d('+v+'px, 0, 0)';
				}
			}
		};
		var getData = function(){
			var itemsList = [];
			var icons = {
				'有声开讲': '0_0',
				'早知道' : '0_1',
				'投资速递' : '1_1',
				'财经要闻' : '1_2',
				'广发晨会' : '1_3',
				'盘中播报' : '1_4',
				'金管家内参' : '1_5',
				'公司研究' : '1_6',
				'宏观与行业' : '1_7',
				'公告与提醒' : '1_9',
				'基金及其他产品' : '1_8',
				'投教基地' : '1_10',
				'新闻资讯' : '2_1',
				'广发研究报告' : '2_2',
				'第三方研究' : '2_3',
				'广发期货报告' : '2_4',
				'基金看市' : '2_5',
				'金管家基金投资策略' : '2_6',
				'金管家套餐示范组合' : '2_7',
				'金管家低风险投资策略' : '2_8',
				'金管家盘中播报至尊版' : '2_9',
				'金管家衍生品投资策略' : '2_10',
				'金管家投资速递' : '3_1',
				'金管家专题报告' : '3_2',
				'金管家A股策略报告' : '3_3'
			};
			// $('#loadingContainer').show();

			var itemsList = [
				[
					{title: '有声开讲', isNew: true, url: '#/category', icon: '1'},
					{title: '国内财经', url: 'news/index.html#/newsList/n10002', icon : '2'},
					{title: '国际财经', url: 'news/index.html#/newsList/n10003', icon: '3'}
				],
				[
					{title: '宏观新闻', url: 'news/index.html#/newsList/n10313', icon : '4'},
					{title: '市场新闻', url: 'news/index.html#/newsList/n10001', icon: '5'},
					{title: '基金看市', url: 'news/index.html#/newsList/n10101', icon : '6'}
				],
				[
					{title: '板块新闻', url: 'news/index.html#/newsList/n10201', icon: '7'},
					{title: '公告与提醒', url: '#/news?url=' + window.encodeURIComponent('secondPage?catCode=first_009_nokhh'), icon: '8'},
					{title: '投教基地', url: 'http://edu.gf.com.cn/', icon: '9'}
				]
			];

			$scope.itemsList = itemsList;
		}
		$scope.openUrl = function(url,title){
			if(url.indexOf('news/index.html')<0){
				window.location = url;
			}else{
				localStorage.setItem('newsTitle',title);
				var href = location.origin+location.pathname;
				var str = href.slice();
				str = str.substr(0,str.length-10); //截取index.html字符，拼成本地访问路径
				url = str + url;
				if (window.JSB_CONFING.mode == 'android') {
					JavaScriptBridge.revealController('web', url);
				}else if (window.JSB_CONFING.mode == 'ios') {
					getBridge().callHandler("revealController", {
						'controllertype':'web',
						'data': url
					}, function(){});
				}
			}
		}
		getData();
		window.RELOAD = getData;
		JSBridge.setWebviewTitle('广发资讯中心');
	};
	App.NavigationCtrl.$inject = ['$scope', '$http', '$routeParams'];
})(window.App || (window.App = {}));