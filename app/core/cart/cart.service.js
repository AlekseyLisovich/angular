angular.module('cartService', ['ngRoute', 'firebase'])

.service('cart', ['$location', function($location) {
    this.products = [];
    this.addProducts = function(data) {
        this.products.push(data);
        localStorage.prod = JSON.stringify(this.products);
        console.log(this.products);
    }

    this.getProducts = function() {
        return JSON.parse(localStorage.prod);
    }
}]);
