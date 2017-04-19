window.audio = undefined;

!(function(Action,$){
    'use strict';

    Action.broadcast = function($scope, $timeout, $routeParams, $window, AudioLecture) {
        // 自定义的变量（函数）放在这里 
        var categoryId = $routeParams.categoryId,
            providerId = $routeParams.providerId,
            curEpisodeId = $routeParams.episodeId,
            canPre = true, canNext = true, episodeArrFN = [],nowEpisodeFN ;
        if($routeParams.from == 'native'){

            var tmpFun = function(num,epi,arr){
                if(epi){
                    arr.push(epi);
                    curEpisodeId == epi ? nowEpisodeFN = num : null;
                }
            }
            var routeParamsLength = 0;
            for(var routeParam in $routeParams){
                routeParamsLength++;
            }
            for(var routeParam in $routeParams){
                for(var xi = 1; xi < (routeParamsLength); xi++){
                    if( routeParam == 'episode'+xi){
                        console.log($routeParams[routeParam]);
                        tmpFun(xi,$routeParams[routeParam],episodeArrFN);
                    }
                }
            }
        }

        var $thumbUp = undefined, $thumbDown = undefined;
        var episodeArray = undefined;
        var notInside = true;
        // var audio = undefined;
        var timer = '';
        //截取字符串，多余的部分用...代替
        var setString = function(str, len) {
            var strlen = 0;
            var s = "";
            for (var i = 0; i < str.length; i++) {
                if (str.charCodeAt(i) > 128) {
                    strlen += 2;
                } else {
                    strlen++;
                }
                s += str.charAt(i);
                if (strlen >= len) {
                    if(str.length == len){
                        return s;
                    }else{
                        return s+"...";
                    }
                }
            }
            return s;
        }
        var listenAudio = function (episodeId) {
            AudioLecture.listen(episodeId).then(function(epi) {
                $scope.badNetTip1 = false;
                canPre = true, canNext = true;
                if(0 != epi.ret) {
                    $scope.staObj.noRight = true;
                    $scope.staObj.showMask = true;
                    audio && audio.loadRes('', !!audio);   // 从可播放切到不可播放的音频时，这一句是必须的，否则出现既有浮层，并播放的场景

                    var $img = $('.no-right-img');
                    $img.width(document.body.clientHeight*0.5*(750/640));
                    return;
                }
                
                $scope.staObj.noRight = false;
                $scope.staObj.showMask = false;
                AudioLecture.setEpisodeDesc(episodeId, epi.data.desc);
                if (!$scope.epiArrLen) {
                    $scope.episode = epi.data;
                    setPageInfo();
                }
                
                if (!audio) {
                    var script = document.createElement('script');
                    script.setAttribute('src','js/audio.js');
                    var head = document.getElementsByTagName('head')[0];
                    head.appendChild(script);
                    if(script.readyState){
                        script.onreadystatechange = function(){
                            if(window.shouye){  // 如果已经退回到列表页了，不要加载音频。防止出现列表页播放音频的情况
                                return;
                            } 
                            if(script.readyState === 'loaded' || script.readyState === 'complete'){
                                script.onreadystatechange = null;
                                audio = new window.Audio();
                                JSBridge.setAudioSessionActive(true);   // ios锁屏播放的，
                                audio.loadRes(epi.data.file_url, false);                                
                            }
                        }
                    }else{
                        script.onload = function(){
                            if(window.shouye){  // 如果已经退回到列表页了，不要加载音频。
                                return;
                            } 
                            audio = new window.Audio();
                            JSBridge.setAudioSessionActive(true);
                            audio.loadRes(epi.data.file_url, false);
                        }
                    }   
                }
                else {
                    !window.shouye && audio.loadRes(epi.data.file_url, !!audio); // 如果已经退回到列表页了，不要加载音频。
                }
                if($routeParams.from == 'native'){
                    $routeParams.categoryId = epi.data.category.id;
                    setPageInfo();
                }
            },function(){
                $scope.badNetTip1 = true;
            });
        };
        var setPageInfo = function () {
            $scope.playFrameStyle = {
                'background-image': 'url(".' + ($scope.episode.player_thumb || './img/player/04.png') + '")'
            };
            var musicTitle = setString($scope.episode['title'],16);
            JSBridge.setWebviewTitle(musicTitle);
            $scope.playBgStyle = {
                'background-image': 'url(".' + ($scope.episode.playbg_thumb || './img/playbg/01.jpg') + '")'
            };

            initThumb();

            JSBridge.setAudioInfoTemp($scope.episode['title'], $scope.episode.provider.name, $scope.episode.category.name, ''); 
        };
        var initThumb = function () {
            // 如果没有用zepto操作过赞、踩，则ng的双向绑定能够正常运作。研究不深，无解…
            $thumbUp && $thumbUp.removeClass('thumb-active').find('sup').text($scope.episode.like_count);
            $thumbDown && $thumbDown.removeClass('thumb-active').find('sup').text($scope.episode.dislike_count);
        };
        var initPlayBoard = function () {
            providerId = $scope.providerId;
            curEpisodeId = $scope.episodeId || curEpisodeId;
            var episodeArrayClone = AudioLecture.getEpisodesPlayable(providerId ? 'provider' : 'category', providerId||categoryId);
            episodeArray = episodeArrayClone.slice();
            listenAudio(curEpisodeId);

            for (var i= 0, len = episodeArray.length; i < len; i++) {
                if (episodeArray[i].id === curEpisodeId) {
                    $scope.episode = episodeArray[i];
                    $scope.curEpiIndex = i;
                    setPageInfo();
                    notInside = false;
                    break;
                }
            }
            if($routeParams.from === 'top' && notInside){
                var topOne = JSON.parse(localStorage.getItem('cloneEpisode'));
                episodeArray.unshift(topOne);
                $scope.episode = topOne;
                $scope.curEpiIndex = 0;
                setPageInfo();
            }

            $scope.epiArrLen = episodeArray.length;
            if($routeParams.from === 'native'){
                $timeout(function(){
                    console.log('disable');
                    $('#nextItem').removeClass('disable');
                },300);

                // console.log($scope.curEpiIndex);
                // console.log($scope.epiArrLen);
            }
        };

        
        // scope的变量（函数）放在这里
        
        // 和父scope双向绑定的变量
        /*$scope.boardName,
        $scope.isReback,
        $scope.providerId,
        $scope.episodeId,
        $scope.navTitle,*/
        
        // 指令内部用到的变量
        $scope.episode = undefined;
        $scope.staObj = $scope.staObj || {};
        $scope.staObj.noRight = false; 
        $scope.staObj.showMask = false;
        $scope.bMsg = '';
        $scope.playFrameStyle = undefined;
        $scope.playBgStyle = undefined;
        $scope.curEpiIndex = 0;
        $scope.epiArrLen = 0;

        if($routeParams.from == 'native') {
            $scope.curEpiIndex = nowEpisodeFN;
        }

        $scope.reloadBroadcast = function(){
            listenAudio(curEpisodeId);
        };
        $scope.switchAudio = function ($event) {
            if ($scope.staObj.noRight) {
                $event.preventDefault();
                $scope.staObj.showMask = true;
                return true;
            }
        };
        $scope.showThumb = function (type, evt) {
            var $target = $(evt.target);

            if ($target[0].tagName != 'SPAN') {
                $target = $target.parent();
            }

            var $sup = $target.find("sup");

            if (type ==='up') {
                $thumbUp = $target;

                if ($target.hasClass('thumb-active')) {
                    $target.removeClass('thumb-active');

                    var like_count = (parseInt($sup.text()) || 1) - 1;

                    $scope.episode.like_count = like_count;
                    $sup.text(like_count);
                }
                else {
                    AudioLecture.like(curEpisodeId).then(function (data){
                        
                    });
                    // 1、不依赖后台结果；2、快速点击，第一次like尚未返回时，会多次点赞
                    var like_count = (parseInt($sup.text()) || 0) + 1;
                    var $thumb_down = $target.next();

                    $thumbDown = $thumb_down;
                    $scope.episode.like_count = like_count;
                    $sup.text(like_count);
                    $target.addClass('thumb-active');

                    if ($thumb_down.hasClass('thumb-active')) {
                        var $sup2 = $thumb_down.find('sup');
                        var dislike_count = (parseInt($sup2.text()) || 1) - 1;

                        $thumb_down.removeClass('thumb-active');
                        $scope.episode.dislike_count = dislike_count;
                        $sup2.text(dislike_count);
                    }
                }
            }
            else if (type === 'down'){
                $thumbDown = $target;

                if ($target.hasClass('thumb-active')) {
                    $target.removeClass('thumb-active');

                    var dislike_count = (parseInt($sup.text()) || 1) - 1;

                    $scope.episode.dislike_count = dislike_count;
                    $sup.text(dislike_count);
                }
                else {
                    AudioLecture.dislike(curEpisodeId).then(function (data){
                        
                    });
                    // 1、不依赖后台结果；2、快速点击，第一次like尚未返回时，会多次点赞
                    var dislike_count = (parseInt($sup.text()) || 0) + 1;
                    var $thumb_up = $target.prev();

                    $thumbUp = $thumb_up;
                    $scope.episode.dislike_count = dislike_count;
                    $sup.text(dislike_count);
                    $target.addClass('thumb-active');

                    if ($thumb_up.hasClass('thumb-active')) {
                        var $sup2 = $thumb_up.find('sup');
                        var like_count = (parseInt($sup2.text()) || 1) - 1;

                        $thumb_up.removeClass('thumb-active');
                        $scope.episode.like_count = like_count;
                        $sup2.text(like_count);
                    }
                }
            }
        };
        $scope.showComment = function (navTitle) {
            $scope.boardName = 'COMMENT';
            $scope.navTitle = navTitle;
            $scope.isReback = false;            
        };

        $scope.shareMusicFun = function (navTitle){
            var lohash = $window.location.hash;
            AudioLecture.share(curEpisodeId).then(function (data) {
                // console.log($scope.episode);
                // console.log('https://info.gf.com.cn/web/pod/index.html' + lohash);
                // console.log('https://info.gf.com.cn/web/pod/index.html#/play_comment?episodeId=' + $scope.episode.id+'&categoryId='+$scope.episode.category.id);
            });
            JSBridge.shareMusic(function(){},$scope.episode['title'], '摘要：' + $scope.episode['abst'],
                // 'https://store.gf.com.cn/mobile/other/app-5.1-promo?_gfsrc=androidshare_x_x_moible','');
                // 'http://10.2.122.58:88/web/' + $window.location.hash, '');
                'https://info.gf.com.cn/web/pod/index.html#/play_comment?episodeId=' + $scope.episode.id+'&categoryId='+$scope.episode.category.id, 'https://cdn.gfzq.cn/info/wx/img/gf-icon.png');
        };

        $scope.pre = function (evt) {
            if(!canPre){    //正在请求上一首时，不让再请求上一首
                return;
            }
            canPre = false;
            //从原生列表进入的音频，让播放器循环从原生列表进入的音频
            if($routeParams.from == 'native' && $routeParams.fromProviderList != 'Yes'){
                episodeArray = episodeArrFN;
                $scope.bMsg = '';
                if ($scope.curEpiIndex <= 0) {
                    var $msgtext = $('.audio-broadcast-msg').find('i');
                    $msgtext.data('offside',true).text('已经是第一首了哦').show();
                    canPre = true;
                    $timeout.cancel(timer);
                    timer = $timeout(function () {
                        $msgtext.data('offside',false).text('').hide();
                        audio.trigger('res-loaded');
                    }, 5000);
                    return;
                }

                $scope.staObj.noRight = false;
                $scope.staObj.showMask = false;
                $scope.curEpiIndex -= 1;
                //$scope.episode = episodeArray[$scope.curEpiIndex];
                //curEpisodeId = $scope.episode.id;
                curEpisodeId = episodeArray[$scope.curEpiIndex];
                $scope.episodeId = curEpisodeId;

                listenAudio(curEpisodeId);
            }else{
                $scope.bMsg = '';
                if ($scope.curEpiIndex <= 0) {
                    var $msgtext = $('.audio-broadcast-msg').find('i');
                    $msgtext.data('offside',true).text('已经是第一首了哦').show();
                    canPre = true;
                    $timeout.cancel(timer);
                    timer = $timeout(function () {
                        $msgtext.data('offside',false).text('').hide();
                        audio.trigger('res-loaded');
                    }, 5000);
                    return;
                }

                $scope.staObj.noRight = false;
                $scope.staObj.showMask = false;
                $scope.curEpiIndex -= 1;
                $scope.episode = episodeArray[$scope.curEpiIndex];
                curEpisodeId = $scope.episode.id;
                $scope.episodeId = curEpisodeId;

                setPageInfo();
                listenAudio(curEpisodeId);
            }
        };
        $scope.next = function () {
            if(!canNext){
                return;
            }
            canNext = false;

            //从原生列表进入的音频，让播放器循环从原生列表进入的音频
            if($routeParams.from == 'native' && $routeParams.fromProviderList != 'Yes'){
                episodeArray = episodeArrFN;
                $scope.bMsg = '';
                if ($scope.curEpiIndex >= episodeArray.length-1) {
                    var $msgtext = $('.audio-broadcast-msg').find('i');
                    $msgtext.data('offside',true).text('播完了，听听其他栏目吧').show();
                    canNext = true;
                    $timeout.cancel(timer);
                    timer= $timeout(function () {
                        $msgtext.data('offside',false).text('').hide();
                        //$scope.bMsg = '';
                        audio.trigger('res-loaded');
                    }, 5000);
                    return;
                }

                $scope.staObj.noRight = false;
                $scope.staObj.showMask = false;

                $scope.curEpiIndex += 1;
                //$scope.episode = episodeArray[$scope.curEpiIndex];
                //curEpisodeId = $scope.episode.id;
                curEpisodeId = episodeArray[$scope.curEpiIndex];
                $scope.episodeId = curEpisodeId;


                listenAudio(curEpisodeId);

            }else{
                $scope.bMsg = '';
                if ($scope.curEpiIndex >= episodeArray.length-1) {
                    var $msgtext = $('.audio-broadcast-msg').find('i');
                    $msgtext.data('offside',true).text('播完了，听听其他栏目吧').show();
                    canNext = true;
                    $timeout.cancel(timer);
                    timer= $timeout(function () {
                        $msgtext.data('offside',false).text('').hide();
                        //$scope.bMsg = '';
                        audio.trigger('res-loaded');
                    }, 5000);
                    return;
                }

                $scope.staObj.noRight = false;
                $scope.staObj.showMask = false;

                $scope.curEpiIndex += 1;
                $scope.episode = episodeArray[$scope.curEpiIndex];
                curEpisodeId = $scope.episode.id;
                $scope.episodeId = curEpisodeId;

                setPageInfo();
                listenAudio(curEpisodeId);
            }

        };
        $scope.playLogin = function () {
            var rightType = $scope.episode.right_type;
            var commonLogin = function (res) {
                listenAudio(curEpisodeId);

                var phase = $scope.$$phase;

                if(phase != '$apply' && phase != '$digest') { //安全apply
                    $scope.$apply($scope.staObj.noRight = false);
                }
                else {
                    $scope.staObj.noRight = false;
                }
            };

            if (1 == rightType) {   // 广发通权限的音频
                JSBridge.loginGFT(function (res) {
                    JSBridgeCallBack.getGFTUserInfoCb(res);  //这个函数中的setCookie是调用jsb，异步的，因此直接commonLogin(res)时，cookie仍然为空，则listen返回无权限。为免回调过深，简单延迟处理
                    setTimeout(function() {
                        commonLogin(res);
                    }, 100);
                });
            } 
            else {  // 交易或收费权限的音频
                JSBridge.loginTrade(function (res) {
                    JSBridge.getGFTUserInfo(JSBridgeCallBack.getGFTUserInfoCb);
                    JSBridgeCallBack.getUserInfoCb(res);
                    setTimeout(function(){
                        commonLogin(res);
                    }, 100);
                });
            }

            AudioLecture.stat(curEpisodeId, 2).then(function (data) {
            });
        };
        $scope.playRegist =  function () {
            JSBridge.registGFT(function(){});
            AudioLecture.stat(curEpisodeId, 3).then(function (data) {
            });
        };
        $scope.$watch('boardName', function (newVal, oldVal, context) {
            if ('PLAY' === newVal) {
                $scope.staObj.showDownGuider = !window.userData.mobileMode;
                if (!context.isReback) {    // 从页面按钮操作进入播放页(1、主页点击音频；2、金牌主讲Tab点击音频)，需要重新播放音频，并设置返回按钮的操作
                    initPlayBoard();
                    AudioLecture.stat(curEpisodeId, 1).then(function (data) {
                    });

                    context.audioPlayed = true;
                    if($routeParams.from == 'native'){
                        window.back = function () { // 如果从原生界面的音频列表进入，返回是直接返回
                            return false;
                        }
                    }else{
                        window.back = function () { // 音频加载中的时候退回时首页时，必须loadRes('')，否则首页会继续播放，因为audio不会从内存中马上清除
                            audio && audio.loadRes('');
                            audio = null;
                            window.defultBackFun();
                            window.back = window.defultBackFun;
                            return true;
                        }
                    }


                    /*if (!oldVal || 'PLAY' == oldVal) { // 1、
                        // 使用默认的window.back,参照script.js
                        window.back = window.defultBackFun;
                    }
                    else if ('COMMENT' === oldVal) {    // 2、
                        window.back =  function () {
                            $scope.navTitle = 'provider';
                            $scope.boardName = 'COMMENT';
                            $scope.isReback = true;
                            $scope.$apply();

                            return true;
                        };
                    }*/
                }
                else {  // 点击返回按钮进入的（只有一种情况，就是从评论页），正在播放的音频就OK，但需要用默认的window.back重新设置按钮的操作
                    if(!$scope.staObj.noRight && !audio){
                        initPlayBoard();
                    }


                    if($routeParams.from == 'native'){
                        window.back = function () { // 如果从原生界面的音频列表进入，返回是直接返回
                            return false;
                        }
                    }else{
                        window.back = function () {
                            audio && audio.loadRes('');
                            audio = null;
                            window.defultBackFun();
                            window.back = window.defultBackFun;
                            return true
                        }
                    }
                }
            }
        });


        // 立即运行的代码放在这里
        // ('PLAY' == $scope.boardName) && initPlayBoard();
    };

    angular.module('app').directive('gfBroadcast', ['$routeParams', '$timeout', '$window', 'AudioLecture',
        function ($routeParams, $timeout, $window, AudioLecture) {
            return {
                restrict: 'A',
                scope: false,
                /*scope: {
                    boardName: '=',
                    isReback: '=',
                    providerId: '=',
                    episodeId: '=',
                    navTitle: '='
                },*/
                link: function ($scope, $element, $attr) {
                    Action.broadcast($scope, $timeout, $routeParams, $window, AudioLecture);
                }   // link     
            };      // return
        }
    ]);
}) (window.Action || (window.Action = {}),$);
