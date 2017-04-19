!(function(Action,$){
    'use strict';
    Action.categoryList = function($scope,$rootScope, $window, $timeout, AudioLecture) {
        var getFirstOne = function(id){         //通过置顶音频episode_id取置顶信息
            if(id){
                AudioLecture.getTheFirstOne(id).then(function (data) {
                    if(data.ret == 0){
                        var d = data.data || {};
                        $scope.episode_01 = d;
                        $rootScope.cloneEpisode = d;
                    }
                },function(){
                    $('.broadcast').height('10.2rem');
                    $('#episode-navs').height('100%');
                    $('#episode-list-wrap').height('100%');
                    console.log('置顶音频信息加载超时');
                    $scope.isBadNetwork1 = true;
                    $scope.ColumnNotEmpty = false;
                    $scope.isBadNetwork2 = false;
                });
            }
        }

        var navScroller = null, epiScroller = null, pageNum = 1, isEnd = {};
        var hasMoreEpisode = false;
        var orderEpisode = function (data) {
            var result = [];
            if(!data || data.length<1)return result;
            result= data.sort(function(a,b){
             return  b.top - a.top;
            });
            return result;
        };
        var navSwitch = function (evt) {
            var target = $(evt.target);
            if(target[0].tagName.toLowerCase()!='a'){
               target = target.parent();
            }
            if (!target.hasClass('active')) {
                target.addClass('active');
                target.siblings().removeClass('active');
            }
        };
        var navAdjust = function () {   //左侧导航加滑动事件
            $timeout(function(){
                $('#episode-navs').height($(window).height()-$(".broadcast").height());
                navScroller = new iScroll('episode-navs',{
                    vScrollbar: false
                });
            }, 0);
        };
        var episodeListCb = function (obj) {
            if (!obj) {
                return;
            }
            
            getFirstOne($scope.categoryId);
            hasMoreEpisode = obj.more;
            $scope.episodes = obj.data;
            // $scope.episode_01 = obj.data[0] || {};
            $('#pullUp').removeClass('loading').find('.pullUpLabel').html('上拉加载更多...');
            isEnd[''+$scope.categoryId] = hasMoreEpisode;
            $scope.canLoad = isEnd[''+$scope.categoryId];

            if (!obj.data.length) {
                $scope.ColumnNotEmpty = false;
            }
            else {
                $scope.ColumnNotEmpty = true;
            }

            var phase = $scope.$$phase;
            if(phase != '$apply' && phase != '$digest') { //安全apply
                $scope.$apply();
            }

            $('#episode-list-wrap').scrollTop(0);
            pageNum = 2;


           /* var u = window.navigator.userAgent;
            if(u.indexOf('Android') > -1 || u.indexOf('Linux') > -1){   //android
                var num = u.substr(u.indexOf('Android') + 8, 3);
                console.log(num);
                console.log(num < 5.0);
                if(num < 5.0){      //安卓5.0以下刷新-webkit-transition属性不及时
                    var $episodeListWrapSub = $('#episode-list-wrap-sub');
                    $episodeListWrapSub.attr('style','-webkit-transition: -webkit-transform 0ms; transition: -webkit-transform 0ms; -webkit-transform-origin: 0px 0px;');
                    $timeout(function(){
                        $episodeListWrapSub.css('-webkit-transform','translate(0px, 0px) translateZ(0px)');
                        refreshScroll();
                    },10);
                }else{
                    $timeout(function(){
                        refreshScroll();
                    },0);
                }
            }else{
                var $episodeListWrapSub = $('#episode-list-wrap-sub');  //处理由于iphone5刷新-webkit-transition属性不及时导致问题
                $episodeListWrapSub.attr('style','-webkit-transition: -webkit-transform 0ms; transition: -webkit-transform 0ms; -webkit-transform-origin: 0px 0px;');
                $timeout(function(){
                    $episodeListWrapSub.css('-webkit-transform','translate(0px, 0px) translateZ(0px)');
                    refreshScroll();
                },10);
            }*/


        };
        var isAndroid4 = function(){
            var u = window.navigator.userAgent;
            if(u.indexOf('Android') > -1 || u.indexOf('Linux') > -1){   //android
                var num = u.substr(u.indexOf('Android') + 8, 3);
                console.log(num);
                console.log(num < 4.4);
                if(num < 4.4){      //安卓4.3以上的不提示
                    $scope.androidTips = true;
                }
            }

        };
        AudioLecture.getAllCategories().then(function (data) { //必须得保证第一ajax请求完后进行第二次ajax请求
            $('#loadingContainer').show();
            var categories = data.data;
            $scope.categories = categories;
            $scope.categoryId =  categories[0]['id'];//当前导航栏id
            navAdjust();
            isAndroid4();
            return AudioLecture.getEpisodesByCategoryId(categories[0]['id'],1,true);
        },function(resp){
            $('.broadcast').height('10.2rem');
            $('#episode-navs').height('100%');
            $('#episode-list-wrap').height('');
            console.log('获取栏目信息，网络超时!');
            $scope.isBadNetwork1 = true;
        }).then(function (obj) {
            $scope.canLoad =true;
            episodeListCb(obj);
        },function(resp){
            $('.broadcast').height('10.2rem');
            $('#episode-navs').height('100%');
            $('#episode-list-wrap').height('');
            console.log('获取音频列表，网络超时!');
            $scope.isBadNetwork2 = true;
        });

        // !window.userData.mobileMode && cookie && cookie.removeSpecific(['TRADING_ACCOUNT', 'TRADING_PASSWD', 'GFT_TOKEN'], {path: '/'}); 
        // // JSBridge.removeCookie('10.2.122.58');
        // JSBridge.setCookie(window.cookieDomain, 'TRADING_ACCOUNT', '');
        // JSBridge.setCookie(window.cookieDomain, 'TRADING_PASSWD', '');
        // JSBridge.setCookie(window.cookieDomain, 'GFT_TOKEN', '');
        // window.localStorage.removeItem('TRADING_ACCOUNT');
        // window.localStorage.removeItem('TRADING_PASSWD');
        // window.localStorage.removeItem('GFT_TOKEN');
        
        JSBridge.setWebviewTitle('有声开讲');
        JSBridge.getGFTUserInfo(JSBridgeCallBack.getGFTUserInfoCb);
        JSBridge.getUserInfo(JSBridgeCallBack.getUserInfoCb);

        $scope.categoryNav = function (evt, categoryId) {
            $scope.categoryId = categoryId;
            navSwitch(evt);
            pageNum = 1;
            $scope.canLoad = isEnd[''+$scope.categoryId];
            if(isEnd[''+$scope.categoryId] === undefined){
                $scope.canLoad = true;
            }
            AudioLecture.getEpisodesByCategoryId(categoryId,1,true).then(function (obj) {
                episodeListCb(obj);
            },function(resp){
                $('.broadcast').height('10.2rem');
                $('#episode-list-wrap').height('');
                console.log('获取音频列表，网络超时!');
                $scope.isBadNetwork2 = true;
            });
            var acn_target = $(evt.target);
            var acn = $(acn_target[0]).html();
            // console.log({audioCategoryId: $scope.categoryId,audioCategoryName: $.trim(acn)});
            window.StatisticsFunc({audioCategoryId: $scope.categoryId,audioCategoryName: $.trim(acn)});
        };
        $scope.topRedirectAudio = function(episodeId){
            localStorage.setItem('cloneEpisode',JSON.stringify($rootScope.cloneEpisode));
            $window.location.href = ['#/play_comment?episodeId=', episodeId, '&categoryId=', $scope.categoryId, '&from=top'].join('');//location 下面的还是会执行的,等执行完了，才会向下跳
        };
        $scope.redirectAudio = function(episodeId){
            $window.location.href = ['#/play_comment?episodeId=', episodeId, '&categoryId=', $scope.categoryId].join('');//location 下面的还是会执行的,等执行完了，才会向下跳
        };
        $scope.showCommentList = function(episodeId, navTitle, $event){
            navTitle = navTitle || 'comment';
            $window.location.href = ['#/play_comment?episodeId=', episodeId, '&categoryId=', $scope.categoryId, '&navTitle=', navTitle].join('');
            $event.stopPropagation();
        };
        $timeout(function () {
            var $elw = $('#episode-list-wrap');
            $elw.height($('body').height()-$(".broadcast").height());
            var flag = true;
            pageNum = 2;

            $elw.scrollTop(0);
            $elw.unbind().on('scroll',function(){
                var pH = $elw.height();
                var pT = $elw.get(0).scrollHeight;
                var pS = $elw.scrollTop();
                if (pS/(pT -pH)>=0.99 && flag && hasMoreEpisode) {
                    flag = false;
                    $('#pullUp').addClass('loading').find('.pullUpLabel').html('玩命加载中...');
                    AudioLecture.getEpisodesByCategoryId($scope.categoryId, pageNum).then(function (obj){
                        flag = true;
                        pageNum ++;
                        hasMoreEpisode = obj.more;
                        $('#pullUp').removeClass('loading').find('.pullUpLabel').html('上拉加载更多...');
                        $scope.episodes.push.apply($scope.episodes, obj.data);
                        isEnd[''+$scope.categoryId] = obj.more;
                        $timeout(function () {
                            $scope.canLoad = hasMoreEpisode;
                        }, 1);
                    },function(resp){
                        $('.broadcast').height('10.2rem');
                        $('#episode-list-wrap').height('');
                        console.log('上拉获取下一页音频列表，网络超时!');
                        $scope.isBadNetwork2 = true;
                    });

                }
            });
        }, 0);

        window.shouye = true;   // 是否首页，出现首页继续播放的情况。加保险
        if(window.audio){       //!!!一进页面停止播放
            try{
                window.audio.loadRes('');
            }catch(e){
                console.log(e);
            }finally{
                window.audio = null;
            }
        }
    };

    Action.categoryList.$inject = ['$scope','$rootScope', '$window', '$timeout', 'AudioLecture'];
})(window.Action || (window.Action = {}),$);
