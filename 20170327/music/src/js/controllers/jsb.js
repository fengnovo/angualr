var JSBridgeCallBack = {
    getUserInfoCb: function (res) {
        var tn, tradeid, uuid, password,
            userInfo = res.userInfo || res.data;   //userInfo 安卓的，data ios的
        if (userInfo) {
            if (userInfo.mobile_phone){
                tn = userInfo.mobile_phone;
            }
            if (userInfo.client_id){
                tradeid = userInfo.client_id;
            }
            if (userInfo.device_uuid){
                uuid = userInfo.device_uuid;
            }
            if (userInfo.password){
                password = userInfo.password;
            }
            window.userData.u = tradeid + '-' + password + '-' + tn + '-' + uuid;
            window.userData.ver = userInfo.device||userInfo.device_mode + '-' + userInfo.system_version + '-' + userInfo.software_version;

            // window.localStorage.setItem('TRADING_ACCOUNT', tradeid || '');
            // window.localStorage.setItem('TRADING_PASSWD', password || '');
            // JSBridge.setCookie(window.cookieDomain, 'TRADING_ACCOUNT', tradeid || '');
            // JSBridge.setCookie(window.cookieDomain, 'TRADING_PASSWD', password || '');
            
            // !window.userData.mobileMode && cookie && cookie.set({  // 本地调试用，否则无cookie可用
            //     TRADING_ACCOUNT: tradeid || '',
            //     TRADING_PASSWD: password || ''
            // }, {
            //     path: '/'
            // });
        }
    },

    getGFTUserInfoCb: function (res) {
        var token, userInfo = res.userInfo; //userInfo ios的 android的 res.access_token;

        if (userInfo) {
            token = userInfo.access_token;
        }
        else {
            token = res.access_token
        }

        // window.localStorage.setItem('GFT_TOKEN', token || '');
        // JSBridge.setCookie(window.cookieDomain, 'GFT_TOKEN', token || '');
        // !window.userData.mobileMode && cookie && cookie.set({
        //   GFT_TOKEN: token || ''
        // }, {
        //     path: '/'
        // });
    },

    getDeviceInfoCb: function (res) {
        var sys = 'ios';
        var deviceInfo = res ? res.data : undefined;

        if (deviceInfo) {
            window.userData.ver = sys + '-' + deviceInfo.operationSystemType + '-' + deviceInfo.softwareVersion;
        }
    }
};

var JSBridge = {
    setWebviewTitle: function (title) {
        if(window.JSB_CONFING.mode == 'android'){
            JavaScriptBridge.setTitle(title);
        }else if(window.JSB_CONFING.mode == 'ios'){
            //iOS新版App已实现setTittle接口 -- qiuhongfeng
            if(window.setTitle)
                window.setTitle(title);
        }else {
            window.gWebViewTitle = title;
        }
    },

    getUserInfo: function (cb) {
        if (window.JSB_CONFING.mode == 'android') {
          var res = JavaScriptBridge.getUserInfoSilent();
          
          res && cb(JSON.parse(res));
        }else if(window.JSB_CONFING.mode == 'ios'){
            getBridge().callHandler("TraderManager_getLogginedTrader", {"forceLogin": false}, cb);
            // getBridge().callHandler('getUserInfo', {}, cb);
        }else {
            console.log('获取交易用户信息失败!');
            //alert('获取交易用户信息失败!');
        }
    },

    getGFTUserInfo: function (cb) {
        if (window.JSB_CONFING.mode == 'android') {
          var res = JavaScriptBridge.getGfCommInfo();

          res && cb(JSON.parse(res));
        }else if(window.JSB_CONFING.mode == 'ios'){
            getBridge().callHandler('getGfCommInfo', {}, cb);
        }else {
            console.log('获取广发通用户信息失败!');
            //alert('获取广发通用户信息失败!');
        }
    },

    loginTrade: function (cb) {
        if (window.JSB_CONFING.mode == 'android') {
            window.androidGetUserInfo = function(res){
            cb(JSON.parse(res));
          };
          JavaScriptBridge.getUserInfo('androidGetUserInfo');
        }else if(window.JSB_CONFING.mode == 'ios'){
            getBridge().callHandler('getUserInfo', {}, cb);
        }else {
            console.log('登陆交易账户失败!');
        }
    },

    loginGFT: function (cb) {
        if (window.JSB_CONFING.mode == 'android') {
            window.androidLoginGftCb = function (res) {
              cb && cb(JSON.parse(res));
            };
            JavaScriptBridge.loginGfComm('androidLoginGftCb'); 
        }else if (window.JSB_CONFING.mode == 'ios') {
            getBridge().callHandler('loginGfComm', {}, cb);
        }else {
            console.log('登陆广发通失败!');
        }
    },

    registGFT: function (cb) {
        if (window.JSB_CONFING.mode == 'android') {
            // JavaScriptBridge.revealController('web','https://account.gf.com.cn/appStore');
            JavaScriptBridge.revealController('web','https://store.gf.com.cn/mobile/other/scancode?channel=etj00001');
        }else if (window.JSB_CONFING.mode == 'ios') {
            getBridge().callHandler("revealController", {
                'controllertype':'web',
                // 'data':'https://account.gf.com.cn/appStore'
                'data': 'https://store.gf.com.cn/mobile/other/scancode?channel=etj00001'
            },cb);
        }
    },

    shareMusic: function(cb,title,description,pageUrl,thumbUrl) {
        if (window.JSB_CONFING.mode == 'android') {
            JavaScriptBridge.shareWebPage(title,description,pageUrl,thumbUrl);
        }else if (window.JSB_CONFING.mode == 'ios') {
            getBridge().callHandler("shareWebPage", {
                "title": title,
                "pageUrl": pageUrl,
                "description": description,
                "thumbUrl": thumbUrl// "thumbUrl": "分享小图标"
            }, cb);
        }
    },

    setCookie: function (url, name, value) {
        // window.setCookieCb = function () {console.log('setCookieCb')};
        // window.setCookieErrCb = function () {console.log('setCookieErrCb')};
        // if (window.JSB_CONFING.mode == 'android') {
        //     JavaScriptBridge.setCookieValue(url, name, value, 'setCookieCb', 'setCookieErrCb');
        // }
        // else if (window.JSB_CONFING.mode == 'ios') {
        //     JavaScriptBridge.setCookieValue(url, name, value, window.setCookieCb, window.setCookieErrCb);
        // }
        // else {
        //     console.log('非手机平台!');
        // } 
    },

    removeCookie: function (url) {
        window.removeCookieCb = function () {console.log('removeCookieCb')};
        window.removeCookieErrCb = function () {console.log('removeCookieErrCb')};
        if (window.JSB_CONFING.mode == 'android') {
            JavaScriptBridge.removeCookieForUrl(url, 'removeCookieCb', 'removeCookieErrCb');
        }
        else if (window.JSB_CONFING.mode == 'ios') {
            JavaScriptBridge.removeCookieForUrl(url, window.removeCookieCb, window.removeCookieErrCb);
        } 
        else {
            console.log('非手机平台!');
        } 
    }, 

    setAudioSessionActive: function (active) {
        if (window.JSB_CONFING.mode == 'ios') {
            JavaScriptBridge.setAudioSessionActive(active);
        } 
        else {
            console.log('非ios平台!');
        } 
    },

    setAudioInfoTemp: function (title, artist, albumTitle, artWork) {
        this.AudioInfoTemp = {title: title, artist: artist, albumTitle: albumTitle, artWork: artWork}
    },

    setAudioInfo: function (totalPlaybackTime, elapsedPlaybackTime) {
        var title = this.AudioInfoTemp.title,
            artist = this.AudioInfoTemp.artist,  
            albumTitle = this.AudioInfoTemp.albumTitle, 
            artWork = this.AudioInfoTemp.artWork;

        if (window.JSB_CONFING.mode == 'ios') {
            JavaScriptBridge.setAudioInfo(title, artist, totalPlaybackTime, elapsedPlaybackTime || 0, albumTitle, artWork);
        } 
        else {
            console.log('非ios平台!');
        } 
    }
};

// 获取iOS用户信息
/*function onBridgeReady(event) {
  var bridge = event.bridge;
  var uniqueId = 1;
  bridge.init(function (message, responseCallback) {    
  });

  getBridge().callHandler('getCurrentUser', {}, function(r){
    var tn = ' ';
    var uuid = ' ';
    var tradeid = ' ';
    var portalid = ' ';
    if(r){
      if(r.mobile_phone){
        tn = r.mobile_phone;
      }
      if(r.client_id){
        tradeid = r.client_id;
      }
      if(r.device_uuid){
        uuid = r.device_uuid;
      }
      if(r.portal_id){
        portalid = r.portal_id;
      }
      window.userData.u = tradeid + '-' + portalid + '-' + tn + '-' + uuid;
    }    
  });
  getBridge().callHandler('getDeviceInfo', {}, function(r){
    if(r.data){
      var deviceInfos = r.data;
      window.userData.ver = 'ios-' + deviceInfos.operationSystemType + '-' + deviceInfos.softwareVersion;
    }    
  });
};

document.addEventListener('WebViewJavascriptBridgeReady', onBridgeReady, false);

// 获取android用户信息
function onAndroidReady(msg) {  
  if(!JavaScriptBridge){
    return
  }
  var clientId = '';
  var deviceInfos = JSON.parse(window.JavaScriptBridge.getDeviceInfo());    
  var userInfo = JavaScriptBridge.getUserInfoSilent();
  if(userInfo){
    userInfo = JSON.parse(userInfo).userInfo;
    var tn = ' ';
    var uuid = ' ';
    var tradeid = ' ';
    var portalid = ' ';
    if(userInfo){
      if(userInfo.mobile_phone){
        tn = userInfo.mobile_phone;
      }
      if(userInfo.client_id){
        tradeid = userInfo.client_id;
      }
      if(userInfo.device_uuid){
        uuid = userInfo.device_uuid;
      }
      if(userInfo.portal_id){
        portalid = userInfo.portal_id;
      }
    }     
    window.userData.u = tradeid + '-' + portalid + '-' + tn + '-' + uuid;
  }
  if(deviceInfos){
    if(deviceInfos.operationSystemType && deviceInfos.osVersion && deviceInfos.softwareVersion){
      window.userData.ver = deviceInfos.operationSystemType + '-' + deviceInfos.osVersion + '-' + deviceInfos.softwareVersion;
    }
  }*/

    // alert(JSON.stringify(window.userData));
    // window.androidData = {
    //   deviceInfos: {
    //     phoneNo: "13800138000",
    //     verifyCode: "xxxxxx",
    //     operationSystemType : "android",
    //     deviceID: "xxxxxx",
    //     device: "M51w",
    //     softwareVersion: "4.8.4.1",
    //     gfId: "",
    //     sdkVersion: "19"
    //   },
    //   userInfo: {
    //     branch_no: "301",
    //     password_type: "2",
    //     password: "xxxxxx",
    //     device_mode: "android",
    //     mobile_phone: "13800138000",
    //     software_version: "4.8.4.1.20141014.66065",
    //     device_uuid: "xxxxxx",
    //     op_station: "xxxxxx",
    //     gf_id: "",
    //     fund_account: "15016104",
    //     client_id: "030180019768",
    //     client_name: "深A0019685930",
    //     software_type: "01000",
    //     system_version: "4.4.4",
    //     status: "successful"
    //   }
    // }
  
// }