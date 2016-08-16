'use strict';

angular.module('register', ['ngRoute', 'firebase', 'auth'])

// Declared route
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/register', {
        templateUrl: 'partials/components/login/register.html',
        controller: 'RegisterCtrl'
    });
}])


.controller('RegisterCtrl', ['$scope', 'singOut', function($scope, singOut) {
    $scope.singOut = function() {
        singOut.registration($scope.user.email, $scope.user.password);
    }
}]);
