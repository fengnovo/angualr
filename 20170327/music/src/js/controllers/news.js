!(function() {
	'use strict';
	App.NewsCtrl = function($scope, $http, $routeParams, $location){
	//	var newsContainer = $('#newsContainer').height($('#container').height() - 50);
		var scroller = null;
		var detailScroller = null;
		var loadingTips = $('#newsContainer .loadingTips');
		var itemInserted = false;

		var refreshScroll = function(){
			if(scroller){
				setTimeout(function(){
					scroller.refresh();
				}, 1);
			}
		};

		var refreshDetailScroll = function(){
			if(detailScroller){
				setTimeout(function(){
					detailScroller.refresh();
				}, 1);
			}
		};
		var cutStringByViewSize = function(str, viewSize) {
			var charCode, currentViewSize, index, strLength;
			strLength = str.length;
			viewSize *= 2;
			currentViewSize = 0;
			index = 0;
			while (index !== strLength) {
				charCode = str.charCodeAt(index);
				if (charCode < 0xff) {// 吊得很,这儿是空格的的计算,是空格的全是true;
					currentViewSize++;
				} else {
					currentViewSize += 2;
				}
				index++;
				if (currentViewSize > viewSize) {
					break;
				}
			}
			if (index === strLength) {
				return str;
			} else {
				return str.substring(0, index) + '...';
			}
		};
		var getData = function(page, cb){
			window.RELOAD = function(){
				getData(page, cb);
			};
			loading = true;
			var url = baseUrl + '&nextpage=' + page + '&rownum=18&initdate=0&totalpages=' + page;
			var addedUserDataUrl = window.addUserDataToUrls(url);
			$http.get(addedUserDataUrl).success(function(res){
				if(res.status == 500){
					last = true;
					return;
				}
//				angular.forEach(res, function(item){
//					item.url = window.encodeURIComponent(item.url);
//				});

				$scope.itemList.push.apply($scope.itemList, res);
				cb(insertItem);
				loading = false;
				$('#loadingContainer').hide();
				loadingTips.removeClass('hidden').text('往上拖动加载更多...');
				refreshScroll();
			}).error(function(res){
				last = true;
				loading = false;
				$('#loadingContainer').hide();
			});
		};
		// 获取需要嵌入的中证数据
		var getInsertItem = function(insertNewsUrl, cb){
			var addedUserDataUrl = window.addUserDataToUrls(insertNewsUrl);
			$http.get(addedUserDataUrl).success(function(res){
				if(res.length){
					insertItem = res[0];
					insertItem.infoSrc = 'zhongZheng';
					delete insertItem.abstract;
				}
				cb(insertItem);
			}).error(function(res){
				// console.dir(res);
			})
		}
		// 把获取到的中证数据嵌入到原有列表
		var addInsertItem = function(insertItem){
			if(insertItem && !itemInserted){
				var insertItemTimestamp = new Date(insertItem.datetime).getTime();				
				angular.forEach($scope.itemList, function(item, itemIndex){
					var itemTimestamp = new Date(item.datetime).getTime();
						if(!itemInserted && insertItemTimestamp >= itemTimestamp){
							$scope.itemList.splice(itemIndex, 0, insertItem);
							itemInserted = true;
						}
				});
			}else{
				// console.dir('nothing added')
			}
		}

		var loadMore = function(){
			if(loading){
				return;
			}
			$scope.page++;
			$scope.$apply(function() {
				$location.search('page', $scope.page);
			});
//			getData($scope.page);
		};

		var routeUpdate = function(){
			getData($scope.page, addInsertItem);
		};

		var showDetail = function(item){
			$('#loadingContainer').show();
			var _back = window.back;
			window.back = function(){
				$scope.$apply(function(){
					$scope.step = 0;
				});
				window.back = _back;
				detailScroller.scrollTo(0, 0);
				return true;
			};
			var itemUrl = 'http://mds.gf.com.cn/webinfo/' + item.url;
			var addedUserDataUrl = window.addUserDataToUrls(itemUrl);
			$http.get(addedUserDataUrl).success(function(res){
				if(!item.infoSrc && res){
					res.content = res.content.replace(/\n/g, '<br>');
					$scope.item = res;
					refreshDetailScroll();
					$('#loadingContainer').hide();
					$scope.step = 1;
				}else if(item.infoSrc == 'zhongZheng' && res){
					$scope.dataUrl = res.content;
					$('#loadingContainer').hide();
					$scope.step = 2;
				}
			}).error(function(){
				$('#loadingContainer').hide();
			});
		}


		$scope.select = function(index){
			var item = $scope.itemList[index];
			showDetail(item);
		};

		$scope.$on('$routeUpdate', routeUpdate);

		var last = false;
		if($routeParams.category == '财经要闻'){
			var insertNewsUrl = 'http://mds.gf.com.cn/webinfo/secondPage?catCode=first_zzst&nextpage=1&rownum=2&initdate=0&totalpages=1';
		}else if($routeParams.category == '公司研究'){
			var insertNewsUrl = 'http://mds.gf.com.cn/webinfo/secondPage?catCode=first_ggjd&nextpage=1&rownum=2&initdate=0&totalpages=1';
		}else if($routeParams.category == '公告与提醒'){
			var insertNewsUrl = 'http://mds.gf.com.cn/webinfo/secondPage?catCode=first_zzkx&nextpage=1&rownum=2&initdate=0&totalpages=1';
		}
		var baseUrl = 'http://mds.gf.com.cn/webinfo/' + window.decodeURIComponent($routeParams.url).replace('&nextpage=1', '');
		var loading = false;
		var insertItem = null;
		$scope.itemList = [];
		$scope.page = 1;
		$scope.step = 0;
		$('#loadingContainer').show();
		if(insertNewsUrl){
			getInsertItem(insertNewsUrl, addInsertItem);
		}
		getData($scope.page, addInsertItem);
		var scrolling = false;
		setTimeout(function(){
			scroller = new iScroll('newsContainer', {
				topOffset : 50,
				onScrollMove : function(){
					scrolling = true;
				},
				onScrollEnd : function(){
					if(scrolling && this.maxScrollY < 0 && this.y <= this.maxScrollY){
						scrolling = false;
						loadingTips.removeClass('hidden').text('正在加载中，请稍候...');
						loadMore();
					}
				}
			});
			detailScroller = new iScroll('detailwrapper');
		}, 0);

	};
	App.NewsCtrl.$inject = ['$scope', '$http', '$routeParams', '$location'];
})(window.App || (window.App = {}));