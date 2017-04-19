var moduleApp = moduleApp || angular.module('dao_service',[]);
var HowLongTimeOut = 20000; //设置多久超时
window.userData = {
    app: 'gf-mobile',
    mobileMode: true     // 手机静态资源模式，cookie设置用jsb；网络模式，cookie设置用cookie.js插件
};
 // var cookieDomain = '10.2.122.58';
// var cookieDomain = 'pod.gf.com.cn';
// var cookieDomain = '10.2.124.210';
var cookieDomain = 'info.gf.com.cn';


  // var baseUrl = '/pod';        // 开发环境
 // var baseUrl = 'http://10.2.124.210:9000/pod';      // 测试环境
// var baseUrl = 'http://pod.gf.com.cn/api/information/podcastserver/1.0.0';   // 生产环境
var baseUrl = 'https://info.gf.com.cn/api/1.0.0/pod';   // 生产环境

//测试环境地址  http://10.2.124.210:9000/pod/categories ，线上的地址http://pod.gf.com.cn/api/information/podcastserver/1.0.0/categories

moduleApp.service('AudioLecture', ['$http', '$q', function($http, $q){
    this.getAllCategories = function() {
        var defer = $q.defer();
        $http({
            method:'get',
            url: baseUrl + '/categories',
            timeout: HowLongTimeOut
        }).success(function(res){
            // fn && fn(res.data.list);
            defer.resolve(res);
        }).error(function(data,status,headers,config){
            defer.reject(data);
        });
        return defer.promise;
    };

    this.getTheFirstOne = function(episode_id) {
        var defer = $q.defer();
        $http({
            method:'get',
            url: baseUrl + '/category/'+episode_id+'/top',
            timeout: HowLongTimeOut
        }).success(function(res){
            defer.resolve(res);
        }).error(function(data,status,headers,config){
            defer.reject(data);
        });
        return defer.promise;
    };

    var cateMapEpis = {};// 

    this.getEpisodesByCategoryId = function(categoryId, page_no, fresh) {
        fresh = fresh || false;
        page_no = page_no || 1;
        if (fresh) {    // 强制刷新
            page_no = 1;
            cateMapEpis[categoryId] = undefined;
        }

        var defer = $q.defer();

        if(cateMapEpis[categoryId] && !cateMapEpis[categoryId]['more']){
            defer.resolve(cateMapEpis[categoryId]);
            return defer.promise;
        }

        $http({
            method: 'get',
            url: baseUrl + '/episodes/category/'+categoryId,///episodes//mock/episode.json
            dataType: 'json',
            params: {
                page_size: 10,
                page_no: page_no
            },
            timeout: HowLongTimeOut
        }).success(function (res) {
            var listData;

            if (res.ret != 0) {
                listData = { //提供给controller的接口保持一致
                    more : false,
                    data : []
                };
            }
            else {
                listData = { //提供给controller的接口保持一致
                    more : res.page_count > res.page_no,
                    data : res.data
                };
            }
            defer.resolve(listData);
            
            if (!cateMapEpis[categoryId]) {
                cateMapEpis[categoryId] = listData;
            }
            else {
                cateMapEpis[categoryId]['more'] = listData.more;
                cateMapEpis[categoryId]['data'] = cateMapEpis[categoryId]['data'].concat(res.data);//每一次把远程的数据和已有的数据和并在一起    
            }
        }).error(function(data,status,headers,config){
            defer.reject(data);
        });

        return defer.promise;
    };
    this.getEpisodesPlayable = function (type, id) {
        var obj;

        if ('provider' === type) {
            obj = provMapEpis[id] || {};
            return obj.data || [];
        }
        else {
            obj = cateMapEpis[id] || {};
            return obj.data || [];
        }
    };

    var getEpisodeById = function (episodeId) {
        var defer = $q.defer();
        
        $http({
            method: 'get',
            url: baseUrl + '/episode/'+episodeId,
            dataType: 'json',
            timeout: HowLongTimeOut
        }).success(function(res){
            defer.resolve(res.data);
        }).error(function(data,status,headers,config){
            defer.reject(data);
        });
        return defer.promise;
    };
    this.getBroadcastEpisode = function(categoryId, episodeId) {
        var defer = $q.defer();
        var categoryData = cateMapEpis[categoryId];
        var episodes = categoryData ? categoryData['data'] : [];

        if (categoryData && episodeId){
            var episode, theTopOne, notInsideFlag = true;

            for(var i = 0, len = episodes.length; i < len; i++) {
                episode = episodes[i];
                if(episode.id === episodeId) {
                    notInsideFlag = false;
                    defer.resolve(episode);
                    break;
                }
            }
            if(notInsideFlag){      //如果循环遍历没有，认为从置顶音频进入
                theTopOne = JSON.parse(localStorage.getItem('cloneEpisode'));
                defer.resolve(theTopOne);
            }

            return defer.promise;
        } else {
            return getEpisodeById(episodeId);
        }
    };

    var epiMapDesc = {};
    this.setEpisodeDesc = function (episodeId, desc) {
        epiMapDesc[episodeId] = desc;
    }
    this.getEpisodeDesc = function (episodeId) {
        return epiMapDesc[episodeId];
    }

    this.getProviderById = function(providerId) {
        var defer = $q.defer();
         $http({
             method:'get',
             url: baseUrl + '/provider/'+providerId,
             dataType: 'json',
             timeout: HowLongTimeOut
         }).success(function(res){
             defer.resolve(res);
         }).error(function(data,status,headers,config){
             defer.reject(data);
         });
        return defer.promise;
    };

    var provMapEpis = {};
    this.getEpisodesByProviderId = function(providerId, page_no, fresh) {
        fresh = fresh || false;
        page_no = page_no || 1;
        if (fresh) {    // 强制刷新
            page_no = 1;
            provMapEpis[providerId] = undefined;
        }

        var defer = $q.defer();

        if(provMapEpis[providerId] && !provMapEpis[providerId]['more']){//provMapEpis[providerId]['more'] 这个怎么传给controller,先不管
            defer.resolve(provMapEpis[providerId]);
            return defer.promise;
        }
        $http({
            method:'get',
            url: baseUrl + '/episodes/provider/'+providerId,//episodes mock/episode.json
            dataType: 'json',
            params: {
                page_size: 10,
                page_no: page_no
            },
            timeout: HowLongTimeOut
        }).success(function(res){
            var listData;

            if (res.ret != 0) {
                listData = { //提供给controller的接口保持一致
                    more : false,
                    data : []
                };
            }
            else {
                listData = { //提供给controller的接口保持一致
                    more : res.page_count > res.page_no,
                    data : res.data
                };
            }
            defer.resolve(listData);
            
            if (!provMapEpis[providerId]) {
                provMapEpis[providerId] = listData;
            }
            else {
                provMapEpis[providerId]['more'] = listData.more;
                provMapEpis[providerId]['data'] = provMapEpis[providerId]['data'].concat(res.data);//每一次把远程的数据和已有的数据和并在一起
            }
        }).error(function(data,status,headers,config){
            defer.reject(data);
        });
        return defer.promise;
    };
    this.getProviderEpisode = function(providerId, episodeId) {
        var defer = $q.defer();
        var providerData = provMapEpis[providerId];
        var episodes = providerData ? providerData['data'] : [];

        if (providerData && episodeId) {
            var episode, theTopOne, notInsideFlag = true;

            for(var i = 0, len = episodes.length; i < len; i++) {
                episode = episodes[i];
                if(episode.id === episodeId) {
                    notInsideFlag = false;
                    defer.resolve(episode);
                    break;
                }
            }
            if(notInsideFlag){          //如果循环遍历没有，认为从置顶音频进入
                theTopOne = JSON.parse(localStorage.getItem('cloneEpisode'));
                defer.resolve(theTopOne);
            }
            return defer.promise;
        } else {
            return getEpisodeById(episodeId);
        }
    };
    
    var epiMapComms = {};
    this.getCommentsByEpisodeId = function(episodeId, page_no, fresh) { //这个的providerId 是episode.provider.id中的值
        fresh = fresh || false;
        page_no = page_no || 1;
        if (fresh) {    // 强制刷新
            page_no = 1;
            epiMapComms[episodeId] = undefined;
        }

        var defer = $q.defer();

        if(epiMapComms[episodeId] && !epiMapComms[episodeId]['more']) {
            defer.resolve(epiMapComms[episodeId]);
            return defer.promise;
        }

        $http({
            url: baseUrl +'/comments/episode/'+episodeId,///comments/mock/comment.json
            method: 'get',
            dataType: 'json',
            params: {
                page_size: 10,
                page_no: page_no
            },
            timeout: HowLongTimeOut
        }).success(function (res) {
            var listData;

            if (res.ret != 0) {
                listData = { //提供给controller的接口保持一致
                    more : false,
                    data : []
                };
            }
            else {
                listData = { //提供给controller的接口保持一致
                    more : res.page_count > res.page_no,
                    data : res.data
                };
            }
            defer.resolve(listData);
            
            if (!epiMapComms[episodeId]) {
                epiMapComms[episodeId] = listData;
            }
            else {
                epiMapComms[episodeId]['more'] = listData.more;
                epiMapComms[episodeId]['data'] = epiMapComms[episodeId]['data'].concat(res.data);    
            }
        }).error(function(data,status,headers,config){
            defer.reject(data);
        });
        return defer.promise;
    };
    this.commentLikeCount = function(commentId,type) {//type : up / down
        var defer = $q.defer();
        var suffix = type === 'up'?'like':'dislike';
        $http({
            method: 'put',
            url: baseUrl + '/comment/'+commentId+'/'+suffix,
            timeout: HowLongTimeOut
        }).success(function(res){
            defer.resolve(res.ret);// fn(res.ret); // 看看返回条件是否真确就行了

        }).error(function(data,status,headers,config){
            defer.reject(data);
        });
        return defer.promise;
    };
    this.episodeComment = function(episodeId,params) {
         var defer = $q.defer();
         $http({
             method:'post',
             url: baseUrl + '/episode/'+ episodeId + '/comment',
             data: params,
             headers:{'Content-Type':'application/x-www-form-urlencoded'},
             transformRequest: function(obj){
                 var str = [];
                 for(var p in obj){
                     str.push(encodeURIComponent(p)+ '='+encodeURIComponent(obj[p]));
                 }
                 return str.join('&');
             },
             timeout: HowLongTimeOut
         }).success(function(res){
              defer.resolve(res);//  fn && !res.ret && fn(res.data);
         }).error(function(data,status,headers,config){
             defer.reject(data);
         });
         return defer.promise;
    };

    this.sendReport = function(episodeId,params){
        var defer =$q.defer();
        $http({
            method:'post',
            url: baseUrl + '/episode/'+episodeId+'/report',
            data:params,
            headers:{'Content-Type':'application/x-www-form-urlencoded'},
            transformRequest: function(obj){
                var str = [];
                for(var p in obj){
                    str.push(encodeURIComponent(p)+ '='+encodeURIComponent(obj[p]));
                }
                return str.join('&');
            },
            timeout: HowLongTimeOut
        }).success(function(res){
            defer.resolve(res);
        }).error(function(data,status,headers,config){
            defer.reject(data);
        });
        return defer.promise;
    };
    this.listen = function(episodeId) {
        var defer =$q.defer();
        $http({
            method:'put',
            url: baseUrl + '/episode/'+episodeId+'/listen',
            timeout: HowLongTimeOut
        }).success(function(res){
            defer.resolve(res);
        }).error(function(data,status,headers,config){
            defer.reject(data);
        });
        return defer.promise;
    };
    this.descInfo = function(episodeId) {
        var defer =$q.defer();
        $http({
            method:'get',
            url: baseUrl + '/episode/'+episodeId,
            timeout: HowLongTimeOut
        }).success(function(res){
            defer.resolve(res);
        }).error(function(data,status,headers,config){
            defer.reject(data);
        });
        return defer.promise;
    };
    this.like = function(episodeId){
        var defer =$q.defer();
        $http({
            method:'put',
            url: baseUrl + '/episode/'+episodeId+'/like',
            timeout: HowLongTimeOut
        }).success(function(res){
            defer.resolve(res);
        }).error(function(data,status,headers,config){
            defer.reject(data);
        });
        return defer.promise;
    };
    this.dislike = function(episodeId){
        var defer =$q.defer();
        $http({
            method:'put',
            url: baseUrl + '/episode/'+episodeId+'/dislike',
            timeout: HowLongTimeOut
        }).success(function(res){
            defer.resolve(res);
        }).error(function(data,status,headers,config){
            defer.reject(data);
        });
        return defer.promise;
    };
    this.share = function(episodeId) {
        var defer =$q.defer();
        $http({
            method:'put',
            url: baseUrl + '/episode/'+episodeId+'/share',
            timeout: HowLongTimeOut
        }).success(function(res){
            defer.resolve(res);
        }).error(function(data,status,headers,config){
            defer.reject(data);
        });
        return defer.promise;
    };
    this.stat = function(episodeId, type) {
        var defer =$q.defer();
        $http({
            method:'put',
            url: baseUrl + '/stat/'+episodeId+'/report',
            params: {type: type},   // put传递参数是用params，不是post的data
            timeout: HowLongTimeOut
        }).success(function(res){
            defer.resolve(res);
        }).error(function(data,status,headers,config){
            defer.reject(data);
        });
        return defer.promise;
    };

}]);

