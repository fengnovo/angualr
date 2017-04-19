!(function(Action,$){
    'use strict';
    Action.commentList = function ($scope, $timeout, $window, $routeParams, AudioLecture) {
        // 自定义的变量（函数）放在这里
        var categoryId = $routeParams.categoryId,
            providerId = $routeParams.providerId,
            episodeId = $routeParams.episodeId;
        var isCommentAction = true;

        var pageNum = 1;
        var hasMoreComments = false, hasMoreEpisode = false;
        var providerProfileCss = function(){
            if($('.provider-profile>#profile_detail').height() >= (65)){
                $scope.$apply(function(){
                    $scope.isCallapsiable = true;
                    $scope.isLongText = true;
                });
            }
        };

        var makeNavView = function(navTitle){
            var navTitles = ['comment','detail','provider'];
            for(var i = 0; i < 3; i++) {
                if(navTitles[i] === navTitle) {
                    $scope[navTitles[i]] = true;
                }
                else {
                    $scope[navTitles[i]] = false;
                }
            }
        };
        var loadNavData = function(navTitle){
            pageNum = 1;
            makeNavView(navTitle);
            if(navTitle === 'comment') {        //评论列表
                AudioLecture.getCommentsByEpisodeId(episodeId, 1, true).then(function (obj) {
                    $scope.isBadNetworkDetail = false;
                    hasMoreComments = obj.more;
                    $scope.comments = obj.data;
                    $scope.canLoad1 = hasMoreComments;
                    if (!obj.data.length) {
                        $scope.commentNotEmpty = false;
                    }
                    else {
                        $scope.commentNotEmpty = true;
                    }

                    var flag = true;
                    pageNum = 2;
                    var $commentctn = $('#comment-ctn');
                    $commentctn.scrollTop(0);
                    $commentctn.unbind('scroll').on('scroll',function(){
                        var pH = $commentctn.height();
                        var pT = $commentctn.get(0).scrollHeight;
                        var pS = $commentctn.scrollTop();
                        if (pS/(pT -pH)>=0.99 && flag && hasMoreComments) {
                            flag = false;
                            $('#pullUp1').addClass('loading').find('.pullUpLabel').html('玩命加载中...');
                            AudioLecture.getCommentsByEpisodeId(episodeId, pageNum).then(function (obj){
                                flag = true;
                                pageNum ++;
                                hasMoreComments = obj.more;
                                $('#pullUp1').removeClass('loading').find('.pullUpLabel').html('上拉加载更多...');
                                $scope.canLoad1 = hasMoreComments;
                                $scope.comments.push.apply($scope.comments, obj.data);
                                $timeout(function(){
                                    $scope.canLoad1 = hasMoreComments;
                                },0);
                            },function(){
                                $scope.badNetTabTip = '评论';
                                $scope.switchTab = 'comment';
                                $scope.isBadNetworkDetail = true;

                                $timeout(function () {}, 10);
                            });
                        }
                    });

                },function(){
                    $scope.badNetTabTip = '评论';
                    $scope.switchTab = 'comment';
                    $scope.isBadNetworkDetail = true;

                    $timeout(function () {}, 10);
                });

                $("#replyContent").val('');
            }
            else if (navTitle === 'provider') {
                var providerId = $scope.episode ? $scope.episode.provider.id : $routeParams.providerId;

                $scope.episodes = [];
                $scope.isLoading = true;
                $scope.loadingText = '玩命加载中...';

                AudioLecture.getProviderById(providerId).then(function (res) {
                    $scope.isBadNetworkDetail = false;
                    var data = res.data || {}; //测试用
                    $scope.providerInfo = data;
                    $timeout(function(){
                        providerProfileCss();
                    },0);
                },function(){
                    $scope.badNetTabTip = '主讲人信息';
                    $scope.switchTab = 'provider';
                    $scope.isBadNetworkDetail = true;

                    $timeout(function () {}, 10);
                });

                AudioLecture.getEpisodesByProviderId(providerId, 1, true).then(function (obj) {
                    hasMoreEpisode = obj.more;
                    $scope.canLoad2 = hasMoreEpisode;

                    var data = obj.data;
                    if (!obj.data.length) {
                        $scope.providerNotEmpty = false;
                    }
                    else {
                        $scope.providerNotEmpty = true;
                    }
                    $scope.episodes = data;

                    var flag = true;
                    pageNum = 2;
                    var $pinfo = $('#p-info');
                    $pinfo.scrollTop(0);
                    $pinfo.unbind().on('scroll',function(){
                        var pH = $pinfo.height();
                        var pT = $pinfo.get(0).scrollHeight;
                        var pS = $pinfo.scrollTop();
//                        console.log('pH----$pinfo.height----'+pH);
//                        console.log('pT----获取滚动条高度----'+pT);
//                        console.log('pS----滚动条距离顶部的距离----'+pS);
                        if (flag && hasMoreEpisode && pS/(pT -pH)>=0.99) {
                            flag = false;
                            //$('#pullUp2').addClass('loading').find('.pullUpLabel').html('玩命加载中...');
                            AudioLecture.getEpisodesByProviderId(providerId, pageNum).then(function (obj) {
                                flag = true;
                                pageNum ++;
                                hasMoreEpisode = obj.more;
                                $scope.isLoading = false;
                                $scope.loadingText = '上拉加载更多...';
                                //$('#pullUp2').removeClass('loading').find('.pullUpLabel').html('上拉加载更多...');
                                $scope.canLoad2 = hasMoreEpisode;
                                $scope.episodes.push.apply($scope.episodes, obj.data);
                                $timeout(function () {
                                    $scope.canLoad2 = hasMoreEpisode;
                                }, 0);
                            },function(){
                                $scope.badNetTabTip = '主讲人信息';
                                $scope.switchTab = 'provider';
                                $scope.isBadNetworkDetail = true;
                            });
                        }
                    });
                },function(){
                    $scope.badNetTabTip = '主讲人信息';
                    $scope.switchTab = 'provider';
                    $scope.isBadNetworkDetail = true;

                    $timeout(function () {}, 10);
                });

            }
            else {
                AudioLecture.descInfo(episodeId).then(function (epi) {
                    $scope.isBadNetworkDetail = false;
                    if (0 == epi.ret) {
                        var desc = epi.data.desc;
                        AudioLecture.setEpisodeDesc(episodeId, desc);
                        $scope.episode.desc = desc;
                    }
                },function(){
                    $scope.badNetTabTip = '内容详情';
                    $scope.switchTab = 'detail';
                    $scope.isBadNetworkDetail = true;
                });
            }
        };
        var getRightState = function (rightType) {
            if (0 == rightType) { // 游客权限的音频，默认有评论和看详情的权限
                $scope.staObj.noRight = false;
            }
            else if (1 == rightType) { // 广发通权限的音频，有无权限看是否有“GFT_TOKEN”
                // if (!cookie.get('GFT_TOKEN') || cookie.get('GFT_TOKEN') === "undefined") {
                if (!window.localStorage.getItem('GFT_TOKEN')) {
                    $scope.staObj.noRight = true;
                }else{
                    $scope.staObj.noRight = false;
                }

            }
            else {
                // if (!cookie.get('TRADING_ACCOUNT') || cookie.get('TRADING_ACCOUNT') === "undefined") {
                if (!window.localStorage.getItem('TRADING_ACCOUNT')) {
                    $scope.staObj.noRight = true;

                }else{
                    $scope.staObj.noRight = false;
                }

            }

            var phase = $scope.$$phase;
            if(phase != '$apply' && phase != '$digest') { //安全apply
                $scope.$apply();
            }
        };
        var initCommentBoard = function () {
            var navTitle = $scope.navTitle || $routeParams.navTitle || 'comment';
            providerId = $scope.providerId || $routeParams.providerId;
            episodeId = $scope.episodeId || $routeParams.episodeId;     //音频id

            if (providerId) {   //主讲人id
                AudioLecture.getProviderEpisode(providerId, episodeId).then(function (data) {
                    $scope.episode = data;
                    getRightState(data.right_type);
                    loadNavData(navTitle);
                },function(){
                    $scope.badNetTabTip = '主讲人信息';
                    $scope.switchTab = 'provider';
                    $scope.isBadNetworkDetail = true;

                    $timeout(function () {}, 10);
                });
            }
            else if ($routeParams.categoryId) {  //栏位id
                AudioLecture.getBroadcastEpisode($routeParams.categoryId, episodeId).then(function (data) {
                    $scope.episode = data;
                    getRightState(data.right_type);
                    loadNavData(navTitle);
                },function(){
                    $scope.badNetTabTip = '评论';
                    $scope.switchTab = 'comment';
                    $scope.isBadNetworkDetail = true;

                    $timeout(function () {}, 10);
                });
            }
            else {

            }
        };

        // scope的变量（函数）放在这里
        $scope.episode = undefined;
        $scope.isLongText = false;
        $scope.loadingFlag = false;
        $scope.staObj = $scope.staObj || {};
        $scope.staObj.noRight = false;
        $scope.staObj.reportActivated = false;
        $scope.staObj.showTips = false;
        $scope.tipTitle = '';
        $scope.tipText = '';
        $scope.staObj.alertTips = false;

        $scope.collapseToggle = function(){
            $scope.isLongText = $scope.isLongText ? false :true;
        };
        $scope.navSwitch = function(navTitle){
            pageNum = 1;
            loadNavData(navTitle);
        };
        $scope.reportType = function(evt){
            if($scope.loadingFlag) return;
            $scope.loadingFlag = true;
            var target = evt.target, $target = $(target), params = {};

            $target = target.tagName === 'LI' ? $target: $target.parent();
            if ($target.data('index') === 4) {
                $scope.boardName = 'REPORT';
                $scope.loadingFlag = false;
                $scope.staObj.reportActivated = false;
                return;
            }

            params['content'] = $target.text();
            // params['reporter_id'] = report_id;
            AudioLecture.sendReport(episodeId, params).then(function (res) {
                $scope.loadingFlag = false;
                $scope.staObj.reportActivated = false;
                $scope.staObj.showTips = true;
                $scope.tipTitle = '提交成功';
                $scope.tipText = '非常感谢您的宝贵意见，我们将第一<br/>时间处理跟进';

                var phase = $scope.$$phase;
                if(phase != '$apply' && phase != '$digest') { //安全apply
                    $scope.$parent.$apply();
                }
            });

        };

        $scope.redirectAudio = function(proId, epiId){
            $routeParams.fromProviderList = 'Yes'; //从主讲人列表跳进播放器时新增类似全局的变量，以便播放器不再循环从原生列表进入的音频而循环主讲人列表音频
            $scope.boardName = 'PLAY';
            $scope.isReback = false;
            $scope.providerId = proId;
            $scope.episodeId = epiId;
        };
        $scope.episodeComment = function(){
            var replyContent = $("#replyContent");
            var reply = replyContent.val().trim();

            if (!reply) {
                $scope.staObj.alertTips = true;
                $scope.tipTitle = '提交失败';
                $scope.tipText = '评论内容不能为空';
                return;
            }
            if(!isCommentAction){
                return;
            }

            isCommentAction = false;

            var params = {
                content: reply
            };
            AudioLecture.episodeComment(episodeId, params).then(function (data){
                isCommentAction = true;
                if(data.ret === 0){
                    replyContent.val('');
                    $scope.staObj.showTips = true;
                    $scope.tipTitle = '评论成功';
                    $scope.tipText = '您的评论将在我们后台审核后<br/>才能展示';
                }
            });
        };
        $scope.approve = function(commentId, type, evt){

            var $target = $(evt.target), count = parseInt($target.text())||0;
            var $another = $target.siblings();

            if ($target.hasClass('thumb-active')) {
                $target.removeClass('thumb-active');
                $target.text(count-1);
                return;
            }
            
            if ($another.hasClass('thumb-active')) {
                $another.text(($another.text() || 1)-1);
                $another.removeClass('thumb-active');
            }

            $target.text(count+1);
            $target.addClass('thumb-active');
            //evt.preventDefault();
            //evt.stopPropagation();
            AudioLecture.commentLikeCount(commentId, type).then(function (ret){
                console.log(ret);
            });
        };
        $scope.login = function () {
            var rightType = $scope.episode.right_type;

            if (1 == rightType) {   // 广发通权限的音频
                JSBridge.loginGFT(function (res) {
                    JSBridgeCallBack.getGFTUserInfoCb(res); //这个函数中的setCookie是调用jsb，异步的，因此直接loadNavData('detail')时，cookie仍然为空，则descInfo返回无权限。为免回调过深，简单延迟处理
                    getRightState(rightType);
                    if ($scope.detail) {  // 内容详情Tab，登陆后要展示音频详情，需要load。其他两个tab不用load，是因为已经load数据了
                        $timeout(function () {loadNavData('detail');}, 100);
                    }
                });
            }
            else {  // 交易或收费权限的音频
                JSBridge.loginTrade(function (res) {
                    JSBridge.getGFTUserInfo(JSBridgeCallBack.getGFTUserInfoCb);
                    JSBridgeCallBack.getUserInfoCb(res);
                    getRightState(rightType);
                    if ($scope.detail) {  // 内容详情Tab，登陆后要展示音频详情，需要load。其他两个tab不用load，是因为已经load数据了
                        $timeout(function () {loadNavData('detail');}, 100);
                    }
                });
            }

            AudioLecture.stat(episodeId, 2).then(function (data) {
            });
        };

        $scope.regist =  function () {
            JSBridge.registGFT(function(){});
            AudioLecture.stat(episodeId, 3).then(function (data) {
            });
        };

        $scope.$watch('boardName', function (newVal, oldVal, context) {
            if ('COMMENT' === newVal) {
                if (!context.isReback) {    // 从页面按钮操作进入播放页(1、主页点击音频头像；2、播放页三个操作)，需要加载页面内容，并设置返回按钮的操作
                    initCommentBoard();
                    if (!oldVal  || 'COMMENT' == oldVal) { // 1、
                        // 使用默认的window.back,参照script.js
                        window.back = window.defultBackFun;
                    }
                    else if ('PLAY' === oldVal) {    // 2、
                        window.back =  function () {
                            document.activeElement.blur(); // 取消输入框焦点，隐藏软键盘。active是其他元素也不会产生副作用
                            // $("#replyContent").val('');

                            $scope.navTitle = null;
                            $scope.boardName = 'PLAY';
                            $scope.isReback = true;
                            // $scope.staObj = $scope.staObj || {};
                            $scope.staObj.reportActivated = false;  // 评论页返回播放页时隐藏举报框，若不然，点举报然后返回，下次进来时还有举报框
                            $scope.staObj.showTips = false;         // 提示“评论不能为空”然后返回，下次进来时还有提示；或举报成功然后返回，下次进来也有提示
                            $scope.staObj.alertTips = false;
                            $scope.$apply();

                            return true;
                        };
                    }
                    else {
                        window.back = window.defultBackFun;
                    }
                }
                else {  // 点击返回按钮进入的（1、播放页，主讲人页点音频播放；2、从举报页），需要用默认的window.back重新设置按钮的操作
                    if (context.audioPlayed) {
                        window.back =  function () {
                            document.activeElement.blur(); // 取消输入框焦点，隐藏软键盘。active是其他元素也不会产生副作用
                            // $("#replyContent").val('');

                            $scope.navTitle = null;
                            $scope.boardName = 'PLAY';
                            $scope.isReback = true;
                            // $scope.staObj = $scope.staObj || {};
                            $scope.staObj.reportActivated = false;
                            $scope.staObj.showTips = false;
                            $scope.staObj.alertTips = false;
                            $scope.$apply();

                            return true;
                        };
                    }
                    else {
                        window.back = window.defultBackFun;
                    }
                }
            }
        });

        // 立即运行的代码放在这里
        
    };

    angular.module('app').directive('gfAudioComment', ['$timeout', '$routeParams', '$window', 'AudioLecture', 
        function ($timeout, $routeParams, $window, AudioLecture) {
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
                    Action.commentList($scope, $timeout, $window, $routeParams, AudioLecture);
                }   // link     
            };      // return
        }
    ]);
}) (window.Action || (window.Action = {}),$);
