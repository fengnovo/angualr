var APP = angular.module('APP', ['ngAnimate','ui.router']);

APP.run(function($animate) {
  $animate.enabled(true);
});

var data = [],scrollYH = 0;

var formatterDateTime = function() {
  var date=new Date()
  var month=date.getMonth() + 1
      var datetime = date.getFullYear()
              + ""// "年"
              + (month >= 10 ? month : "0"+ month)
              + ""// "月"
              + (date.getDate() < 10 ? "0" + date.getDate() : date
                      .getDate())
              + ""
              + (date.getHours() < 10 ? "0" + date.getHours() : date
                      .getHours())
              + ""
              + (date.getMinutes() < 10 ? "0" + date.getMinutes() : date
                      .getMinutes())
              + ""
              + (date.getSeconds() < 10 ? "0" + date.getSeconds() : date
                      .getSeconds());
    return datetime;
}

var page = 1,id='5572a108b3cdc86cf39001ce';
var url = function(pageNum){
  return 'https://route.showapi.com/109-35?channelId='+id
                        +'&channelName=&maxResult=20&needAllList=0&needContent=0&needHtml=0&page='+
                        pageNum+'&showapi_appid=27453&showapi_timestamp='+
                        formatterDateTime()+'&showapi_sign=c2dfc63cf8054db8b87bcf204a4987dd';
}
APP.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/home");
  $stateProvider
    .state('home', {
      url: "/home",
      templateUrl: "tpl/home.html",
      controller: function($scope,$http,$timeout){
          $scope.$emit("change",true,'资讯列表');
          $scope.leftorright = true;
          $scope.$emit("close");
          $scope.load2 = false;
          if(data.length === 0){
              $http.get(url(page))
                  .success(function (response) {
                      window.stitle = '互联网之子';
                      window.sdesc = '在长大的过程中，我才慢慢发现，我身边的所有事，别人跟我说的所有事，那些所谓本来如此，注定如此的事，它们其实没有非得如此，事情是可以改变的。更重要的是，有些事既然错了，那就该做出改变。';
                      window.slink = window.location.href;
                      console.log(window.stitle,window.sdesc,window.slink);
                      $('#onMenuShareAppMessage').trigger('click');
                      page ++;
                      $scope.dataset = response.showapi_res_body.pagebean.contentlist;
                      data = $scope.dataset;
                      $timeout(function(){
                        var canLoad = true;
                        var $elw = $('#scroll-area');
                        $elw.height($(window).height()-$(".nav").height());
                        $elw.on('scroll', function () {
                            var pH = this.clientHeight;
                            var pT = this.scrollHeight;
                            var pS = this.scrollTop; // scrollTop，向上滚动（被隐藏）的高度
                            if (canLoad && pT - pH - pS <= 1) {
                                canLoad = false;  //ajax时禁止再发请求
                                 $http.get(url(page))
                                    .success(function (response) {
                                        canLoad = true;
                                        $scope.$emit("close");
                                        page ++;
                                        $timeout(function(){
                                          $scope.dataset = $scope.dataset.concat(response.showapi_res_body.pagebean.contentlist);
                                          data = $scope.dataset;
                                        },0);
                                        
                                    });
                            }
                            scrollYH = pS;
                        });
                        $scope.load2 = true;
                      },0);
                });
          }else{
              $scope.dataset = data;
              $timeout(function(){
                var canLoad = true;
                var $elw = $('#scroll-area');
                $elw.height($(window).height()-$(".nav").height());
                $elw.on('scroll', function () {
                    var pH = this.clientHeight;
                    var pT = this.scrollHeight;
                    var pS = this.scrollTop; // scrollTop，向上滚动（被隐藏）的高度
                    if (canLoad && pT - pH - pS <= 1) {
                        canLoad = false;  //ajax时禁止再发请求
                         $http.get(url(page))
                            .success(function (response) {
                                canLoad = true;
                                $scope.$emit("close");
                                page ++;
                                $timeout(function(){
                                  $scope.dataset = $scope.dataset.concat(response.showapi_res_body.pagebean.contentlist);
                                  data = $scope.dataset;
                                },0);
                            });
                    }
                    scrollYH = pS;
                });
                $scope.load2 = true;
                $elw.scrollTop(scrollYH);
              },0);
          }
              


      }
    })
    .state('detail', {
      url: "/detail?uid",
      templateUrl: "tpl/detail.html",
      controller: function($stateParams,$scope,$http,$sce) {
          $scope.$emit("change",false,'资讯详情');
          $scope.leftorright = false;
          var id = $stateParams.uid;
          $scope.$emit("open");
          $http.get('https://route.showapi.com/883-1?showapi_appid=27453&showapi_timestamp='+formatterDateTime()+'&url='
    +id+'&showapi_sign=c2dfc63cf8054db8b87bcf204a4987dd')
                .success(function (result) {
                    $scope.$emit("close");
                    var content = result.showapi_res_body;
                    $scope.title = content.title;
                    $scope.time = content.time;
                    $scope.app = $sce.trustAsHtml(content.html);
                    window.stitle = $scope.title;
                    window.sdesc = content.html;
                    window.slink = window.location.href;
                    console.log(window.stitle,window.sdesc,window.slink);
                    $('#onMenuShareAppMessage').trigger('click');
                });
      }
    });
});

APP.controller('MainCtrl', function ($scope,$timeout) {
        $scope.leftorright = false;
        $scope.isLoading = true;
        $scope.homePage = true;
        $scope.pageName = '资讯列表';
        $scope.$on("change",function (event, msg,pn) {
            $timeout(function(){
                $scope.homePage = msg;
                $scope.pageName = pn;
            });
        });
        $scope.$on("open",function (event, msg) {
            $timeout(function(){
                $scope.isLoading = true;
            });
        });
        $scope.$on("close",function (event, msg) {
            $timeout(function(){
                $scope.isLoading = false;
            });
        });
    });