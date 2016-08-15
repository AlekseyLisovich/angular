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

'use strict';

angular.module('register', ['ngRoute', 'firebase'])

// Declared route
.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/register', {
        templateUrl: 'partials/components/login/register.html',
        controller: 'RegisterCtrl'
    });
}])

// Register controller
.controller('RegisterCtrl', ['$scope', '$location', '$firebaseAuth', function($scope, $location, $firebaseAuth) {
    var firebaseObj = new Firebase("https://blistering-heat-2473.firebaseio.com");
    var auth = $firebaseAuth(firebaseObj);
        $scope.signUp = function() {
            var email = $scope.user.email;
            var password = $scope.user.password;
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
}]);

'use strict';

// Register `phoneDetail` component, along with its associated controller and template
angular.module('phoneDetails', [])
    .component('phoneDetails', {
        templateUrl: '/partials/components/phone-details/phone-details.template.html',
        controller: ['$http', '$routeParams',
            function PhoneDetailController($http, $routeParams) {
                var self = this;

                self.setImage = function setImage(imageUrl) {
                    self.mainImageUrl = imageUrl;
                };

                $http.get('data/phone/' + $routeParams.phoneId + '.json').then(function(response) {
                    self.phone = response.data;
                    self.setImage(self.phone.images[0]);
                });
            }
        ]
    })
    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/phoneDetails', {
            templateUrl: '/partials/components/phone-details/phone-details.template.html',
            controller: 'phonePost'
        });
    }])
    .controller('phonePost', ['$scope', '$firebase', 'CommonProp', function($scope, $firebase, CommonProp) {
        $scope.username = CommonProp.getUser();
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
                emailId: CommonProp.getUser()
            }).then(function(ref) {
                console.log(ref);
                $location.path('/');
            }, function(error) {
                console.log("Error:", error);
            });
        }
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

angular.module('templates', []).run(['$templateCache', function($templateCache) {$templateCache.put('/static/views/components/addPost/addPost.html','<div ng-controller="AddPostCtrl">\r\n\r\n    <div class="container">\r\n\r\n        <form class="form-horizontal" ng-submit="AddPost()">\r\n            <fieldset>\r\n\r\n                <!-- Form Name -->\r\n                <legend>Create Post</legend>\r\n\r\n                <!-- Text input-->\r\n                <div class="form-group">\r\n                    <label class="col-md-4 control-label" for="txtTitle">Title</label>\r\n                    <div class="col-md-4">\r\n                        <input id="txtTitle" name="txtTitle" ng-model="article.title" type="text" placeholder="Enter a title" class="form-control input-md">\r\n                    </div>\r\n                </div>\r\n\r\n                <!-- Textarea -->\r\n                <div class="form-group">\r\n                    <label class="col-md-4 control-label" for="txtPost">Post</label>\r\n                    <div class="col-md-4">\r\n                        <textarea class="form-control" id="txtPost" ng-model="article.post" name="txtPost"></textarea>\r\n                    </div>\r\n                </div>\r\n\r\n                <!-- Button -->\r\n                <div class="form-group">\r\n                    <label class="col-md-4 control-label" for="singlebutton"></label>\r\n                    <div class="col-md-4">\r\n                        <input id="singlebutton" ng-disabled="!article.title || !article.post" name="singlebutton" class="btn btn-primary" type="submit" value="Publish" />\r\n                    </div>\r\n                </div>\r\n            </fieldset>\r\n        </form>\r\n\r\n        <div class="container-post">\r\n            <div class="list-group" ng-repeat="article in articles">\r\n                <a href="#" onclick="return false;" class="list-group-item active">\r\n                    <h4 >{{article.title}}</h4>\r\n                    <p >{{article.post}}</p>\r\n                  </div>\r\n            </div>\r\n</div>\r\n');
$templateCache.put('/static/views/components/login/home.html','<form class="form-signin" name="signinForm" role="form">\r\n    <div class="form-group" ng-class="{ \'has-error\' : signinForm.email.$invalid }">\r\n        <label>Email</label>\r\n        <input type="email" name="email" class="form-control" ng-model="user.email">\r\n        <p class="help-block" ng-show="signinForm.email.$invalid">Enter a valid email.</p>\r\n    </div>\r\n    <div class="form-group" ng-class="{ \'has-error\' : signinForm.password.$invalid }">\r\n        <label>Password</label>\r\n        <input type="password" name="password" class="form-control" ng-model="user.password" ng-minlength="3">\r\n        <p class="help-block" ng-show="signinForm.password.$error.minlength">Min password length is 8 characters.</p>\r\n    </div>\r\n    <label class="checkbox">\r\n        <a href="#!/register"> Sign Up</a>\r\n    </label>\r\n    <button ng-disabled="!user.email || !user.password" type="button" ng-click="SignIn($event)" class="btn">SignIn</button>\r\n</form>\r\n');
$templateCache.put('/static/views/components/login/register.html','<div ng-controller="RegisterCtrl">\r\n<form class="form-signin" name="signinForm" role="form" >\r\n    <div class="form-group" ng-class="{ \'has-error\' : signinForm.email.$invalid }">\r\n        <label>Email</label>\r\n        <input type="email" name="email" class="form-control" ng-model="user.email">\r\n        <p class="help-block" ng-show="signinForm.email.$invalid">Enter a valid email.</p>\r\n    </div>\r\n    <div class="form-group" ng-class="{ \'has-error\' : signinForm.password.$invalid }">\r\n        <label>Password</label>\r\n        <input type="password" name="password" class="form-control" ng-model="user.password" ng-minlength="3">\r\n        <p class="help-block" ng-show="signinForm.password.$error.minlength">Min password length is 8 characters.</p>\r\n    </div>\r\n    <p style="color:red;" ng-show="regError">{{regErrorMessage}}</p>\r\n    <label class="checkbox">\r\n        <a href="#!/home"> Sign In<a/>\r\n    </label>\r\n    <button type="button" ng-click="signUp();" ng-disabled="!user.email || !user.password" class="btn btn">Register</button>\r\n</form>\r\n</div>\r\n');
$templateCache.put('/static/views/components/phone-details/phone-details.template.html','<div ng-controller="phonePost">\r\n    <img ng-src="{{$ctrl.mainImageUrl}}" class="phone" />\r\n\r\n    <h1>{{$ctrl.phone.name}}</h1>\r\n\r\n    <p>{{$ctrl.phone.description}}</p>\r\n\r\n    <ul class="phone-thumbs">\r\n        <li ng-repeat="img in $ctrl.phone.images">\r\n            <img ng-src="{{img}}" ng-click="$ctrl.setImage(img)"/>\r\n        </li>\r\n    </ul>\r\n\r\n    <ul class="specs">\r\n        <li>\r\n            <span>Availability and Networks</span>\r\n            <dl>\r\n                <dt>Availability</dt>\r\n                <dd ng-repeat="availability in $ctrl.phone.availability">{{availability}}</dd>\r\n            </dl>\r\n        </li>\r\n        <li>\r\n            <span>Battery</span>\r\n            <dl>\r\n                <dt>Type</dt>\r\n                <dd>{{$ctrl.phone.battery.type}}</dd>\r\n                <dt>Talk Time</dt>\r\n                <dd>{{$ctrl.phone.battery.talkTime}}</dd>\r\n                <dt>Standby time (max)</dt>\r\n                <dd>{{$ctrl.phone.battery.standbyTime}}</dd>\r\n            </dl>\r\n        </li>\r\n        <li>\r\n            <span>Storage and Memory</span>\r\n            <dl>\r\n                <dt>RAM</dt>\r\n                <dd>{{$ctrl.phone.storage.ram}}</dd>\r\n                <dt>Internal Storage</dt>\r\n                <dd>{{$ctrl.phone.storage.flash}}</dd>\r\n            </dl>\r\n        </li>\r\n        <li>\r\n            <span>Connectivity</span>\r\n            <dl>\r\n                <dt>Network Support</dt>\r\n                <dd>{{$ctrl.phone.connectivity.cell}}</dd>\r\n                <dt>WiFi</dt>\r\n                <dd>{{$ctrl.phone.connectivity.wifi}}</dd>\r\n                <dt>Bluetooth</dt>\r\n                <dd>{{$ctrl.phone.connectivity.bluetooth}}</dd>\r\n                <dt>Infrared</dt>\r\n                <dd>{{$ctrl.phone.connectivity.infrared}}</dd>\r\n                <dt>GPS</dt>\r\n                <dd>{{$ctrl.phone.connectivity.gps}}</dd>\r\n            </dl>\r\n        </li>\r\n        <li>\r\n            <span>Android</span>\r\n            <dl>\r\n                <dt>OS Version</dt>\r\n                <dd>{{$ctrl.phone.android.os}}</dd>\r\n                <dt>UI</dt>\r\n                <dd>{{$ctrl.phone.android.ui}}</dd>\r\n            </dl>\r\n        </li>\r\n        <li>\r\n            <span>Size and Weight</span>\r\n            <dl>\r\n                <dt>Dimensions</dt>\r\n                <dd ng-repeat="dim in $ctrl.phone.sizeAndWeight.dimensions">{{dim}}</dd>\r\n                <dt>Weight</dt>\r\n                <dd>{{$ctrl.phone.sizeAndWeight.weight}}</dd>\r\n            </dl>\r\n        </li>\r\n        <li>\r\n            <span>Display</span>\r\n            <dl>\r\n                <dt>Screen size</dt>\r\n                <dd>{{$ctrl.phone.display.screenSize}}</dd>\r\n                <dt>Screen resolution</dt>\r\n                <dd>{{$ctrl.phone.display.screenResolution}}</dd>\r\n                <dt>Touch screen</dt>\r\n                <dd>{{$ctrl.phone.display.touchScreen}}</dd>\r\n            </dl>\r\n        </li>\r\n        <li>\r\n            <span>Hardware</span>\r\n            <dl>\r\n                <dt>CPU</dt>\r\n                <dd>{{$ctrl.phone.hardware.cpu}}</dd>\r\n                <dt>USB</dt>\r\n                <dd>{{$ctrl.phone.hardware.usb}}</dd>\r\n                <dt>Audio / headphone jack</dt>\r\n                <dd>{{$ctrl.phone.hardware.audioJack}}</dd>\r\n                <dt>FM Radio</dt>\r\n                <dd>{{$ctrl.phone.hardware.fmRadio}}</dd>\r\n                <dt>Accelerometer</dt>\r\n                <dd>{{$ctrl.phone.hardware.accelerometer}}</dd>\r\n            </dl>\r\n        </li>\r\n        <li>\r\n            <span>Camera</span>\r\n            <dl>\r\n                <dt>Primary</dt>\r\n                <dd>{{$ctrl.phone.camera.primary}}</dd>\r\n                <dt>Features</dt>\r\n                <dd>{{$ctrl.phone.camera.features.join(\', \')}}</dd>\r\n            </dl>\r\n        </li>\r\n        <li>\r\n            <span>Additional Features</span>\r\n            <dd>{{$ctrl.phone.additionalFeatures}}</dd>\r\n        </li>\r\n    </ul>\r\n\r\n    <div class="review-label">\r\n        <h1>Customer review of product</h1></div>\r\n    <div class="review-btn">\r\n        <button class="btn btn-xs btn-edit" ng-show="isLogIn()" data-toggle="modal" data-target="#createModal">Add a comment</button>\r\n    </div>\r\n    <div class="container-post">\r\n        <div class="list-group" ng-repeat="article in articles">\r\n            <a href="#" onclick="return false;" class="list-group-item active">\r\n                <h4>{{article.title}}</h4>\r\n                <p>{{article.post}}</p>\r\n                <span class="pull-right">\r\n          <button class="btn btn-xs btn-edit" ng-click="editPost(article.$id)" data-target="#editModal" style = "background-color: #ff8a65">EDIT</button>\r\n          <button class="btn btn-xs btn-delete" ng-click="confirmDelete(article.$id)" data-target="#deleteModal" >DELETE</button>\r\n        </span>\r\n            </a>\r\n        </div>\r\n\r\n        <div class="modal fade" id="createModal" tabindex="-1" role="dialog" aria-labelledby="createModalLabel" aria-hidden="true">\r\n            <div class="modal-dialog">\r\n                <div class="modal-content">\r\n                    <div class="container">\r\n                        <input type="image" src="img/icon.jpg" class="btn-close_t" data-dismiss="modal">\r\n                        <form class="form-horizontal" ng-submit="AddPost()">\r\n                            <fieldset>\r\n\r\n                                <!-- Form Name -->\r\n                                <legend>Create Post</legend>\r\n\r\n                                <!-- Text input-->\r\n                                <div class="form-group">\r\n                                    <label class="col-md-4 control-label" for="txtTitle">Title</label>\r\n                                    <div class="col-md-4">\r\n                                        <input id="txtTitle" name="txtTitle" ng-model="article.title" type="text" placeholder="Enter a title" class="form-control input-md">\r\n                                    </div>\r\n                                </div>\r\n\r\n                                <!-- Textarea -->\r\n                                <div class="form-group">\r\n                                    <label class="col-md-4 control-label" for="txtPost">Post</label>\r\n                                    <div class="col-md-4">\r\n                                        <textarea class="form-control" id="txtPost" ng-model="article.post" name="txtPost"></textarea>\r\n                                    </div>\r\n                                </div>\r\n\r\n                                <!-- Button -->\r\n                                <div class="form-group">\r\n                                    <label class="col-md-4 control-label" for="singlebutton"></label>\r\n                                    <div class="col-md-4">\r\n                                        <input id="singlebutton" ng-disabled="!article.title || !article.post" name="singlebutton" class="btn btn-primary" type="submit" value="Publish" />\r\n                                    </div>\r\n                                </div>\r\n\r\n                            </fieldset>\r\n                        </form>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n\r\n\r\n        <div class="modal fade" id="editModal" tabindex="-1" role="dialog" aria-labelledby="editModalLabel" aria-hidden="true">\r\n            <div class="modal-dialog">\r\n                <div class="modal-content">\r\n                    <div class="modal-header">\r\n                        <input type="image" src="img/icon.jpg" class="btn-close" data-dismiss="modal">\r\n                        <h4 class="modal-title" id="editModalLabel">Update Post</h4>\r\n                    </div>\r\n                    <div class="modal-body">\r\n                        <form role="form">\r\n                            <div class="form-group">\r\n                                <label for="recipient-name" class="control-label">Title:</label>\r\n                                <input type="text" class="form-control" ng-model="postToUpdate.title" id="recipient-name">\r\n                            </div>\r\n                            <div class="form-group">\r\n                                <label for="message-text" class="control-label">Post:</label>\r\n                                <textarea class="form-control" id="message-text" ng-model="postToUpdate.post"></textarea>\r\n                            </div>\r\n                        </form>\r\n                    </div>\r\n                    <div class="modal-footer">\r\n                        <button type="button" class="btn btn-update" ng-click="update()">Publish</button>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <div class="modal fade" id="deleteModal" tabindex="-1" role="dialog" aria-labelledby="deleteModalLabel" aria-hidden="true">\r\n            <div class="modal-dialog">\r\n                <div class="modal-content">\r\n                    <div class="modal-header" style="text-align:center;">\r\n                        <h4 class="modal-title" style="color:red;" id="deleteModalLabel">You are going to Delete this post forever !!</h4>\r\n                    </div>\r\n\r\n                    <div class="modal-footer">\r\n                        <button type="button" class="btn btn-cancel" data-dismiss="modal">Cancel</button>\r\n                        <button type="button" class="btn btn-delete-p" ng-click="deletePost()">Delete</button>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n\r\n</div>\r\n');
$templateCache.put('/static/views/components/phones-list/phones-list.template.html','<div ng-controller="userName" id = "check">\r\n    <div class="container-fluid">\r\n        <div class="row">\r\n            <div class="col-md-2">\r\n                <p>\r\n                    <div class="searchLabel">Search:</div>\r\n                    <div class="searchInput">\r\n                        <input ng-model="$ctrl.query" />\r\n                    </div>\r\n                </p>\r\n            </div>\r\n            <!-- Modal Trigger -->\r\n              <a class="waves-effect waves-light btn red darken-2 modal-trigger btn-basket" ng-show="isLogIn()" ng-click="getProducts()" href="#modal1" ><i class="material-icons left">shopping_cart</i>Basket</a>\r\n\r\n              <!-- Modal Structure -->\r\n              <div  id="modal1" class="modal basket">\r\n                <div class="modal-content">\r\n                  <h4>Order Confirmation</h4>\r\n                  <p>Are you confirm your order ?</p>\r\n                </div>\r\n                <div ng-controller="phonePost">\r\n                <ul>\r\n                  <div class="list-group" ng-repeat="product in products">\r\n                    <div class = "basket-products">\r\n                    <div class = "basket-image"><img ng-src="{{product.imageUrl}}" style = "width: 100px;"/></div>\r\n                    <p class = "basket-name">{{product.name}}</p>\r\n                    <p >{{product.snippet}}</p>\r\n                  </div>\r\n                  </li>\r\n                </ul>\r\n              </div>\r\n\r\n                <div class="modal-footer">\r\n                  <a href="#!" class=" modal-action modal-close waves-effect waves-green btn-flat" onclick="Materialize.toast(\'\u0421onfirmed\', 2000)">Agree</a>\r\n                  <a href="#!" class=" modal-action modal-close waves-effect waves-green btn-flat" onclick="Materialize.toast(\'Rejected\', 2000)">Disagree</a>\r\n                </div>\r\n              </div>\r\n            </div>\r\n            <div class="col-md-10">\r\n                <!--Body content-->\r\n                <div id="wrapper">\r\n                    <div class="section" ng-repeat="phone in $ctrl.phones | filter:$ctrl.query | orderBy:$ctrl.orderProp">\r\n                        <div class="col s12 m7">\r\n                            <div class="card horizontal">\r\n                                <div class="card-image">\r\n                                    <a href="#!/phones/{{phone.id}}">\r\n                                        <img ng-src="{{phone.imageUrl}}" alt="{{phone.name}}" />\r\n                                    </a>\r\n                                </div>\r\n                                <div class="card-stacked">\r\n                                    <div class="card-content">\r\n                                        <a ng-href="#!/phones/{{phone.id}}">{{phone.name}}</a>\r\n                                        <p>{{phone.snippet}}</p>\r\n                                    </div>\r\n                                    <div class="card-action">\r\n                                        <a href="#">More details</a>\r\n                                        <a class="waves-effect waves-light btn" ng-show="isLogIn()" ng-click="addProducts(phone)">Buy</a>\r\n                                    </div>\r\n                                </div>\r\n                            </div>\r\n                        </div>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n');
$templateCache.put('/static/views/components/welcome/welcome.html','<div ng-controller="WelcomeCtrl">\r\n    <div class="container">\r\n        <div class="list-group" ng-repeat="article in articles">\r\n            <a href="#" onclick="return false;" class="list-group-item active">\r\n                <h4 class="list-group-item-heading">{{article.title}}</h4>\r\n                <p class="list-group-item-text">{{article.post}}</p>\r\n\r\n                <span class="pull-right">\r\n      <button class="btn btn-xs btn-edit" ng-click="editPost(article.$id)" data-target="#editModal" style = "background-color: #ff8a65">EDIT</button>\r\n      <button class="btn btn-xs btn-delete" ng-click="confirmDelete(article.$id)" data-target="#deleteModal" >DELETE</button>\r\n    </span>\r\n            </a>\r\n        </div>\r\n        <div class="modal fade" id="editModal" tabindex="-1" role="dialog" aria-labelledby="editModalLabel" aria-hidden="true">\r\n            <div class="modal-dialog">\r\n                <div class="modal-content">\r\n                    <div class="modal-header">\r\n                        <button type="button" class="close btn-close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>\r\n                        <h4 class="modal-title" id="editModalLabel">Update Post</h4>\r\n                    </div>\r\n                    <div class="modal-body">\r\n                        <form role="form">\r\n                            <div class="form-group">\r\n                                <label for="recipient-name" class="control-label">Title:</label>\r\n                                <input type="text" class="form-control" ng-model="postToUpdate.title" id="recipient-name">\r\n                            </div>\r\n                            <div class="form-group">\r\n                                <label for="message-text" class="control-label">Post:</label>\r\n                                <textarea class="form-control" id="message-text" ng-model="postToUpdate.post"></textarea>\r\n                            </div>\r\n                        </form>\r\n                    </div>\r\n                    <div class="modal-footer">\r\n                        <button type="button" class="btn btn-update" ng-click="update()">Publish</button>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n        <div class="modal fade" id="deleteModal" tabindex="-1" role="dialog" aria-labelledby="deleteModalLabel" aria-hidden="true">\r\n            <div class="modal-dialog">\r\n                <div class="modal-content">\r\n                    <div class="modal-header" style="text-align:center;">\r\n                        <h4 class="modal-title" style="color:red;" id="deleteModalLabel">You are going to Delete this post forever !!</h4>\r\n                    </div>\r\n\r\n                    <div class="modal-footer">\r\n                        <button type="button" class="btn btn-cancel" data-dismiss="modal">Cancel</button>\r\n                        <button type="button" class="btn btn-delete-p" ng-click="deletePost()">Delete</button>\r\n                    </div>\r\n                </div>\r\n            </div>\r\n        </div>\r\n    </div>\r\n    <footer class="footer">\r\n        <div class="container">\r\n            <p class="text-muted"></p>\r\n        </div>\r\n    </footer>\r\n</div>\r\n');}]);
'use strict';

angular.module('welcome', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/welcome', {
        templateUrl: 'partials/components/welcome/welcome.html',
        controller: 'WelcomeCtrl'
    });
}])

.controller('WelcomeCtrl', ['$scope', '$firebase', 'CommonProp', function($scope, $firebase, CommonProp) {
    $scope.username = CommonProp.getUser();
    var firebaseObj = new Firebase("https://blistering-heat-2473.firebaseio.com/Articles");


    var sync = $firebase(firebaseObj);

    $scope.articles = sync.$asArray();
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

//# sourceMappingURL=app.js.map

/*
TODO:
.saveCurrentCart({...})
.ordersHistory - [{},{}]

_.loadHistoryFromLocalStorage()
*/

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

/*
TODO:
.authenticate(username, password)
.unathenticate()

Events:
USER_AUTHETICATED
USER_UNAUTHENTICATED
*/


//# sourceMappingURL=app.js.map
