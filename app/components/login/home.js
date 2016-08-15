'use strict';
angular.module('home', ['ngRoute', 'firebase'])
    // Определение маршрута
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/home', {
            templateUrl: 'partials/components/login/home.html',
            controller: 'HomeCtrl'
        });
    }])
    .controller('HomeCtrl', ['$scope','$location','CommonProp','$firebaseAuth',function($scope,$location,CommonProp,$firebaseAuth) {
        var firebaseObj = new Firebase("https://blistering-heat-2473.firebaseio.com");
        var loginObj = $firebaseAuth(firebaseObj);

        $scope.SignIn = function(e) {
            e.preventDefault();
            var username = $scope.user.email;
            var password = $scope.user.password;
            loginObj.$authWithPassword({
                    email: username,
                    password: password
                })
                .then(function(user) {
                    $location.path('/phones');
                    CommonProp.setUser(user.password.email);
                    console.log('Authentication successful');
                }, function(error) {
                    //Failure callback
                    console.log('Authentication failure');
                });
        }
    }])

    .service('CommonProp', function() {
      var self = this;
      this.setUser = function(value){
        localStorage.setItem("userEmail", value);
          this.username = value;
    }
      this.getUser = function () {
        self.username = localStorage.getItem('userEmail');
        return self.username;
      }
    });
