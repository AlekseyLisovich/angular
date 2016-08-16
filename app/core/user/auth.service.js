'use strict';

angular.module('auth', ['ngRoute', 'firebase'])

.service('singIn', ['$location','UserData','$firebaseAuth',function($location,UserData,$firebaseAuth) {
    var firebaseObj = new Firebase("https://blistering-heat-2473.firebaseio.com");
    var loginObj = $firebaseAuth(firebaseObj);

    this.authorization = function(username, password) {
        loginObj.$authWithPassword({
                email: username,
                password: password
            })
            .then(function(user) {
                $location.path('/phones');
                UserData.setUser(user.password.email);
                console.log('Authentication successful');
            }, function(error) {
                //Failure callback
                console.log('Authentication failure');
            });
    }
}])

.service('singOut', ['$scope', '$location', '$firebaseAuth', function($scope, $location, $firebaseAuth) {
    var firebaseObj = new Firebase("https://blistering-heat-2473.firebaseio.com");
    var auth = $firebaseAuth(firebaseObj);
        this.registration = function(email, password) {
            if (email && password) {
                auth.$createUser(email, password)
                    .then(function() {
                        console.log('User creation success');
                        $location.path('/home');
                    }, function(error) {
                        console.log(error);
                        $scope.regError = true;
                        $scope.regErrorMessage = error.message;
                    });
            }
    };
}])

.service('UserData', function() {
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
