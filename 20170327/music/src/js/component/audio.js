
(function($){
    var Audio = function () {
        this.$control = $('.control-bar');
        this.$audio = $('#audio');
        this.audio = this.$audio[0];
        this.$audioSource = this.$audio.find('source');
        this.$switch = this.$control.find('.btn-switch');
        this.$curTimeBar = this.$control.find('.cur-time-bar');
        this.fullTimeBarW = this.$control.find('.full-time-bar').width();
        this.$slider = this.$control.find('.slider-btn');
        this.$curTime = this.$control.find('.cur-time');
        this.$fullTime = this.$control.find('.full-time');
        this.$frame = $('.roller');
        this.$bMsg = $('.audio-broadcast-msg').find('i');
        this.$nextSong = $('.next');
        this.moveControlId = '';
        this.sourceSrc = '';
    };

    Audio.prototype.loadRes = function (resPath, inited) {
        inited = inited || false;

        var _this = this;
        var $audio = this.$audio;

        this.moveControlId && window.clearInterval(this.moveControlId);
        this.moveControlId = '';
        this.isPausedMove = undefined;
        this.$frame.removeClass('frame-start').addClass('frame-pause');
        this.$switch.addClass('disabled');
        this.$switch.removeClass('btn-pause').addClass('btn-start');
        this.$audio.trigger('abort');
        this.$audioSource.attr({
            src: resPath
        });
        this.sourceSrc = resPath;

        inited && this.freshUI();
        this.initListen();

        this.audio && this.audio.pause();
        this.audio && this.audio.load();
        this.metaDataLoaded = false;
        this.$bMsg.data('offside',false);
        this.sourceSrc ? this.$bMsg.show().text('玩命加载中') : this.$bMsg.show().text('').hide();

        $audio.off('loadedata').on('loadeddata',function () {
            //setTimeout(function () {
                _this.sourceSrc && _this.audio && _this.audio.play();
            //}, 2000);
        });
        
        $audio.on('timeupdate',function () {
            _this.audio.volume = 0;  
            if(_this.audio.currentTime > 0.1){
                if (!_this.sourceSrc) { // iphone4 和ximi延时播放bug
                    _this.audio.pause();
                    _this.$bMsg.show().text('').hide();
                    return;
                }

                _this.metaDataLoaded = true;
                _this.$fullTime.text(_this.calculateTime(_this.audio.duration));
                if (_this.$fullTime.text() !== '00:00') { //xiaom下快速切换容易出现卡顿，直接禁声
                    _this.audio.volume = 1;
                }

                _this.$frame.removeClass('frame-pause').addClass('frame-start');
                _this.$switch.removeClass('btn-start').addClass('btn-pause');
                _this.$switch.removeClass('disabled');
                if(!_this.$bMsg.data('offside')){
                    _this.$bMsg.text('').hide();
                }

                JSBridge.setAudioInfo(_this.audio.duration, _this.audio.currentTime);

                $audio.off('timeupdate');
            }
        });
    };
    Audio.prototype.freshUI = function () {
        this.$slider.css('left', '0');
        this.$curTimeBar.css({width: 0 });
        this.$curTime.text('00:00');
        this.$fullTime.text('00:00');
        return true;
    };
    Audio.prototype.initListen = function () {
        var that = this;

        this.$audio.off('res-loaded').on('res-loaded',$.proxy(this.isResLoaded,this))
        this.$audio.off('pause').on('pause', $.proxy(this.pause,this));
        this.$audio.off('play').on('play', $.proxy(this.play,this));
        this.$audio.off('ended').on('ended', $.proxy(this.ended,this));
        this.$switch.off('click').on('click', $.proxy(this.switch,this));//以PC的click 事件做代替
        this.$slider.off('touchstart').on('touchstart', $.proxy(this.touchStart,this));
        this.$slider.off('touchmove').on('touchmove', $.proxy(this.touchMove,this));
        this.$slider.off('touchend').on('touchend', $.proxy(this.touchEnd,this));

        this.$audio.off('emptied').on('emptied',function () {
            that.audio && that.audio.pause();
        });
        this.$audio.off('error').on('error',function () {
            that.pause();
            that.freshUI();
            that.$bMsg.show().text('网络不给力，请稍后重试');
        });
        return true;
    };

    Audio.prototype.switch = function (eve) {
        if(!this.sourceSrc || this.$switch.hasClass('disabled')) {
            eve.preventDefault();
            return;
        }
        if (this.$switch.hasClass('btn-start')) {
            this.$switch.removeClass('btn-start').addClass('btn-pause');
            this.$frame.removeClass('frame-pause').addClass('frame-start');
            this.audio.play();
        } else {
            this.$switch.removeClass('btn-pause').addClass('btn-start');
            this.$frame.removeClass('frame-start').addClass('frame-pause');
            this.audio.pause();
        }

        JSBridge.setAudioInfo(this.audio.duration, this.audio.currentTime);
    };
    Audio.prototype.touchStart = function (evt) {
        evt.preventDefault();
        if (!this.metaDataLoaded) {
            return;
        }

        window.clearInterval(this.moveControlId);
        this.moveControlId = '';
        this.curBarW = this.$curTimeBar.width();
        this.isPausedMove = this.audio.paused; 
        if(!this.isPausedMove){
            this.audio.pause();
        }

        var target = evt.targetTouches[0];
        var startPos = {
            x: target.pageX,
            y: target.pageY
        };

        this.startPos = startPos;
    };
    Audio.prototype.touchMove = function (evt) {
        if (!this.metaDataLoaded) {
            return;
        }

        var touch = evt.targetTouches[0];
        var  endPos = {
            x: touch.pageX,
            y: touch.pageY
        };
        var startPos = this.startPos;
        var steps = { //得给设置一个区间,超过区间的取区间值
            x: Math.ceil(endPos.x - startPos.x),
            y: Math.ceil(endPos.y - startPos.y)
        };
           
        this.x_pos =  this.calculateMove(steps);
        this.$slider.css('left',this.x_pos);
        this.$curTimeBar.css({width: this.x_pos});
    };
    Audio.prototype.touchEnd = function (evt) {
        if (!this.metaDataLoaded) {
            return;
        }

        var rate = (this.x_pos/this.fullTimeBarW).toFixed(4);

        this.audio.currentTime = Math.floor(this.audio.duration*rate);
        this.$curTime.html(this.calculateTime(this.audio.currentTime));

        if (!this.isPausedMove) {
            this.audio.play();
        }

        JSBridge.setAudioInfo(this.audio.duration, this.audio.currentTime);
    };
    Audio.prototype.calculateMove = function (steps) {
        var fullBarW = this.fullTimeBarW,
            curBarW = this.curBarW,
            x = steps.x;

        if (x <= 0 && x+curBarW < 0) { ////向左拉动的情况
            return 0;
        }
        if (fullBarW <= x+curBarW) { // 向右拉动的情况
            return fullBarW;
        }

        return x + curBarW;
    };
    Audio.prototype.moving = function () {
        var _this = this;
         
        this.moveControlId = setInterval(function () {
            if (_this.metaDataLoaded) {
                if (_this.$fullTime.text() === '00:00') {//iphone4 下bug
                    _this.$fullTime.text(_this.calculateTime(_this.audio.duration));
                }
                var steps = _this.$audio[0].currentTime /_this.$audio[0].duration;
                steps = steps*100 + '%';
                _this.$slider.css('left', steps);
                _this.$curTimeBar.css({width: steps});
                _this.$curTime.html(_this.calculateTime(_this.$audio[0].currentTime));
            }   
        }, 100);
      
    };
    Audio.prototype.start =function () {

    };
    Audio.prototype.error =function () {
    };
    Audio.prototype.ended =function () {
        if(this.audio.duration - this.audio.currentTime > 0.5) {
            return;//iphone6移动之后触发end事件
        }
        this.$slider.css('left','100%');
        this.$curTimeBar.css({width: '100%'});
        this.$switch.removeClass('btn-pause').addClass('btn-start');
        this.moveControlId && window.clearInterval(this.moveControlId);
        this.moveControlId = '';
        this.$curTime.html(this.calculateTime(this.$audio[0].duration));
        if (!this.$nextSong.hasClass('disable') && $('.play-board').css('display') !='none') {
            this.$nextSong.click();
        }
    };
    Audio.prototype.play = function () {
        this.moving();
        if (this.audio.currentTime >0.09 || (this.isPausedMove != undefined && !this.isPausedMove)) {//当播放拖动时拖到头时必须播放
            this.$frame.removeClass('frame-pause').addClass('frame-start');
            this.$switch.removeClass('btn-start').addClass('btn-pause');
            this.$fullTime.text(this.calculateTime(this.audio.duration));
        }
        JSBridge.setAudioInfo(this.audio.duration, this.audio.currentTime);
    };
    Audio.prototype.pause = function () {
        if (this.$audio.currentTime === this.$audio.duration) {
            this.$audio.currentTime = 0;
        }
        this.moveControlId && window.clearInterval(this.moveControlId);
        this.moveControlId = '';
        this.$switch.removeClass('btn-pause').addClass('btn-start');
        this.$frame.removeClass('frame-start').addClass('frame-pause');

        JSBridge.setAudioInfo(this.audio.duration, this.audio.currentTime);
    };
    Audio.prototype.calculateTime = function (time) {
        if (!time) {
            return '00:00';
        }          

        var minutes = '', second;
        minutes = time / 60;
        minutes = parseInt(minutes);
        if (minutes < 10) {
            minutes = '0'+ minutes;
        }
        seconds = time % 60;
        seconds = parseInt(seconds);
        if (seconds < 10) {
            seconds = '0'+ seconds;
        }

        return minutes + ':' + seconds;
    };
    Audio.prototype.trigger = function (evtName) {
        this.$audio.trigger(evtName);
    };
    Audio.prototype.isResLoaded = function () {
        if (this.audio.currentTime < 0.09) {//
            this.$bMsg.show().text('玩命加载中');
        }
    };
    
    window.Audio = Audio;

})(Zepto);
