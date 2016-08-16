angular.module('headerInfo', [])

.controller('header', ['$scope', '$firebase', '$location', 'UserData', function($scope, $firebase, $location, CommonProp) {
    $scope.userService = CommonProp;

    $scope.isLogIn = function() {
        if (!$scope.userService.username) {
            return false;
        } else {
            return true;
        }
    }
}]);

angular.module('userService', [])

.controller('phonePost', ['$scope', '$firebase', 'UserData', function($scope, $firebase, UserData) {
    $scope.username = UserData.getUser();
    var firebaseObj = new Firebase("https://blistering-heat-2473.firebaseio.com/Articles");

    $scope.isLogIn = function() {
        if (!$scope.username) {
            return false;
        } else {
            return true;
        }
    }

    var sync = $firebase(firebaseObj);

    $scope.articles = sync.$asArray();
    $scope.AddPost = function() {
        var title = $scope.article.title;
        var post = $scope.article.post;

        var firebaseObj = new Firebase("https://blistering-heat-2473.firebaseio.com/Articles");
        var fb = $firebase(firebaseObj);

        fb.$push({
            title: title,
            post: post,
            emailId: UserData.getUser()
        }).then(function(ref) {
            console.log(ref);
            $location.path('/');
        }, function(error) {
            console.log("Error:", error);
        });
    }

    $scope.editPost = function(id) {
        console.log(id);
        var firebaseObj = new Firebase("https://blistering-heat-2473.firebaseio.com/Articles/" + id);


        var syn = $firebase(firebaseObj);
        $scope.postToUpdate = syn.$asObject();

        $('#editModal').modal();
    }

    $scope.update = function() {
        console.log($scope.postToUpdate.$id);
        var fb = new Firebase("https://blistering-heat-2473.firebaseio.com/Articles/" + $scope.postToUpdate.$id);
        var article = $firebase(fb);
        article.$update({
            title: $scope.postToUpdate.title,
            post: $scope.postToUpdate.post,
            emailId: $scope.postToUpdate.emailId
        }).then(function(ref) {
            console.log(ref.key()); // bar
            $('#editModal').modal('hide')
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
}]);
