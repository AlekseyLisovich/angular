'use strict';

// Register `phoneList` component, along with its associated controller and template
angular.module('phonesList', ['ngRoute', 'firebase', 'cartService'])

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

.controller('userCart', ['$scope', '$firebase', '$location', 'UserData', 'cart', function($scope, $firebase, $location, CommonProp, cart) {
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
        cart.addProducts(data);
    }

    $scope.getProducts = function() {
        $scope.products = cart.getProducts();
    }

    $scope.addProducts = function(data) {
        cart.addProducts(data);
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
