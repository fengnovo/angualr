!(function(Action,$){
    'use strict';
    //var report_id = window['userData']?window['userData'].split('-')[0]:'游客';
    //var report_id = '游客';
    Action.report = function($scope, $routeParams, $element, AudioLecture) {
        var episodeId = undefined, isReportAction = true;
        var $textArea = $($element.find('textarea'));
        var $contactInput = $($element.find('input'));

        $scope.staObj = $scope.staObj || {};

        $scope.submitReport = function () {
            if (!isReportAction) {
                return;
            }
            isReportAction = false;//提交过程中，不能提交
            episodeId = $scope.episodeId || $routeParams.episodeId;
            var reportContent = $element.find('textarea').val();
            var contact = $element.find('input').val();
            if (!reportContent) {
                //$scope.staObj.showTips = true;
                //$scope.tipTitle = '提示';
                //$scope.tipText = '意见内容不能为空';
                $scope.staObj.alertTips = true;
                $scope.tipTitle = '提交失败';
                $scope.tipText = '意见内容不能为空';
                isReportAction = true;
                return;
            }

            var params = {
                content: reportContent || '',
                contacter: contact || ''
            };
            AudioLecture.sendReport(episodeId, params).then(function (res){
                isReportAction = true;
                $scope.staObj.isSubmitComplaint = true;
                $element.find('textarea').val('');
                $element.find('input').val('');
            });
        };

        $scope.successHandle = function (){
            $scope.staObj.isSubmitComplaint = false;
            $scope.boardName = 'COMMENT';
            $scope.navTitle = 'detail';
            $scope.isReback = true;
        };

        $scope.$watch('boardName', function (newVal, oldVal, context) {
            if ('REPORT' === newVal) {
                window.back = function () {
                    $element.find('textarea').val('');
                    $element.find('input').val('');

                    document.activeElement.blur(); // 取消输入框焦点，隐藏软键盘。active是其他元素也不会产生副作用

                    $scope.staObj.isSubmitComplaint = false;
                    $scope.staObj.showTips = false;
                    $scope.staObj.alertTips = false;
                    $scope.boardName = 'COMMENT';
                    $scope.navTitle = 'detail';
                    $scope.isReback = true;
                    $scope.$apply();

                    return true;
                };
            }
        });
    };

    angular.module('app').directive('gfReport', ['$routeParams', '$window', 'AudioLecture', 
        function ($routeParams, $window, AudioLecture) {
            return {
                restrict: 'A',
                scope: false,
                require: '?ngModel',
                /*scope: {
                    boardName: '=',
                    isReback: '=',
                    episodeId: '='

                },*/
                link: function ($scope, $element, $attr, ngModelCtrl) {
                    Action.report($scope, $routeParams, $element, AudioLecture);
                }   // link     
            };      // return
        }
    ]);
}) (window.Action || (window.Action = {}), $);
