'use strict';
angular.module('home', ['ngRoute', 'firebase', 'auth'])
    // Определение маршрута
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/home', {
            templateUrl: 'partials/components/login/home.html',
            controller: 'HomeCtrl'
        });
    }])

.controller('HomeCtrl', ['$scope', 'singIn', function($scope, singIn) {
    $scope.signIn = function() {
        singIn.authorization($scope.user.email, $scope.user.password);
    }
}]);
