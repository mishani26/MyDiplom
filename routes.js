var app = angular.module("myApp", ["ngRoute"]);
app.config(($routeProvider)=>{
    $routeProvider
    .when("/", {
        templateUrl : "home.html"
    })
    .when("/hello", {
        templateUrl : "hello.html"
    });
});
