angular.module('headerInfo', [])

.controller('header', ['$scope', '$firebase', '$location', 'CommonProp', function($scope, $firebase, $location, CommonProp) {
    $scope.userService = CommonProp;

    $scope.isLogIn = function() {
        if (!$scope.userService.username) {
            return false;
        } else {
            return true;
        }
    }

}]);



/*
TODO:
.loadPhones() - load phones from the json file
.phones - return loaded items, if they are not loaded yet - []
.isDataLoaded() --> if true - return loaded array of phones, otherwise - retrieve them from the data file

Events:
DATA_LOADED
*/
