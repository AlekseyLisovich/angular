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
    }]);
