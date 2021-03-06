'use strict';

angular.module('addPost', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/addPost', {
        templateUrl: 'partials/components/addPost/addPost.html',
        controller: 'AddPostCtrl'
    });
}])

.controller('AddPostCtrl', ['$scope', '$firebase', '$location', 'CommonProp', function($scope, $firebase, $location, CommonProp) {
    $scope.AddPost = function() {
        var title = $scope.article.title;
        var post = $scope.article.post;

        var firebaseObj = new Firebase("https://blistering-heat-2473.firebaseio.com/Articles");
        var fb = $firebase(firebaseObj);

        fb.$push({
            title: title,
            post: post,
            emailId: CommonProp.getUser()
        }).then(function(ref) {
            console.log(ref);
            $location.path('/');
        }, function(error) {
            console.log("Error:", error);
        });
    }

    $scope.products = ["Milk", "Bread", "Cheese"];
    $scope.addItem = function () {
        $scope.products.push($scope.addMe);
    }

}]);
