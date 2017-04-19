!(function(Action,$){
    'use strict';
    Action.playComment = function($scope, $routeParams) {
    	// 自定义的变量（函数）放在这里
        var navTitle = $routeParams.navTitle;

        // scope的变量（函数）放在这里
        $scope.boardName = undefined;
        $scope.isReback = false;
        $scope.audioPlayed = false;
        $scope.providerId = $routeParams.providerId;
        $scope.episodeId = $routeParams.episodeId;
        $scope.navTitle = navTitle;

        $scope.staObj = {};
        $scope.staObj.showDownGuider = !window.userData.mobileMode;

        // 立即运行的代码放在这里
        window.shouye = false;
        if (navTitle) {
        	$scope.boardName = 'COMMENT';
        }
        else {
        	$scope.boardName = 'PLAY';
        }
    };
    Action.playComment.$inject = ['$scope', '$routeParams'];
}) (window.Action || (window.Action = {}),$);
