angular.module('panaReporter' ,['ngRoute'])
    .config(function($routeProvider){
        $routeProvider
            .when('/',{
                templateUrl:'views/login.html',
                controller:'loginCtrl'
            })
            .when('/signUp',{
                templateUrl:'views/signUp.html',
                controller:'signUpCtrl'
            })
            .when('/dashboard',{
                templateUrl:'views/dashboard.html',
                controller:'dashboardCtrl'
            })
            .otherwise({redirectTo:'/'});
    });