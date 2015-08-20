'use strict';


// Controller
angular.module('ngAppDemo.Controllers', [])
    .controller('MainCtrl', ['$scope', '$interval',
        function($scope, $interval) {
            $scope.version = 10;

            $interval(function(e){
                $scope.version += 1;
            }, 1000)
        }
    ])
;


// Main
var App = angular.module('ngAppDemo', [
    'ngAppDemo.Controllers'])
;
