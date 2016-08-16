'use strict';

// Define the `phonecatApp` module
var app = angular.module('phonesApp', [
    'ngRoute',
    'phoneDetails',
    'phonesList',
    'home',
    'register',
    'addPost',
    'welcome',
    'headerInfo',
    'auth',
    'userService',
    // 'cartService',
]);

app.config(['$locationProvider', '$routeProvider',
    function config($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('!');

        $routeProvider.
        when('/phones/:phoneId', {
            template: '<phone-details></phone-details>'
        }).
        otherwise({
            redirectTo: '/phones'
        });
    }
]);

app.controller('loginCtrl', function($scope, $location) {
    $scope.submit = function() {
        var uname = $scope.username;
        var password = $scope.password;
        if ($scope.username === 'admin' && $scope.password === 'admin') {
            $location.path('dashboard');
        }
    };
});
