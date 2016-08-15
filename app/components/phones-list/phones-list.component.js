'use strict';

// Register `phoneList` component, along with its associated controller and template
angular.module('phonesList', [])

.component('phonesList', {
    templateUrl: '/partials/components/phones-list/phones-list.template.html',
    controller: ['$http', function PhoneListController($http) {
        var self = this;
        self.orderProp = 'age';

        $http.get('data/phone/phones.json').then(function(response) {
            self.phones = response.data;
        });
    }]
})

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.
    when('/phones', {
        template: '<phones-list></phone-list>',
        controller: 'WelcomeCtrl'
    });
}])

.controller('userName', ['$scope', '$firebase', '$location', 'CommonProp', function($scope, $firebase, $location, CommonProp) {
    $scope.userService = CommonProp;

    $scope.isLogIn = function() {
        if (!$scope.userService.username) {
            return false;
        } else {
            return true;
        }
    }

    $scope.products = [];
    $scope.addProducts = function(data) {
        $scope.products.push(data);
        localStorage.prod = JSON.stringify($scope.products);
        console.log($scope.products);
    }

    $scope.getProducts = function(){
    $scope.products = JSON.parse(localStorage.prod);
  }

    $scope.AddProducts = function(data) {

        var firebaseObj = new Firebase("https://blistering-heat-2473.firebaseio.com");
        var fb = $firebase(firebaseObj);

        fb.$push({
            img: data.imageUrl,
            name: data.name,
            info: data.snippet,
            emailId: CommonProp.getUser()
        }).then(function(ref) {
            console.log(ref);
        }, function(error) {
            console.log("Error:", error);
        });
    }

    $scope.confirmDelete = function(id) {
        var fb = new Firebase("https://blistering-heat-2473.firebaseio.com/Articles/" + id);
        var article = $firebase(fb);
        $scope.postToDelete = article.$asObject();
        $('#deleteModal').modal();
    }

    $scope.deletePost = function() {
        var fb = new Firebase("https://blistering-heat-2473.firebaseio.com/Articles/" + $scope.postToDelete.$id);
        var article = $firebase(fb);
        article.$remove().then(function(ref) {
            $('#deleteModal').modal('hide');
        }, function(error) {
            console.log("Error:", error);
        });
    }

    // for modal
    $('.modal-trigger').leanModal({
        dismissible: true, // Modal can be dismissed by clicking outside of the modal
        opacity: .5, // Opacity of modal background
        in_duration: 300, // Transition in duration
        out_duration: 200, // Transition out duration
        starting_top: '4%', // Starting top style attribute
        ending_top: '10%', // Ending top style attribute
        ready: function() {}, // Callback for Modal open
        complete: function() {} // Callback for Modal close
    });

}]);
