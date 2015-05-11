angular.module('panaReporter', ['ngRoute', 'ui.bootstrap', 'ngMaterial', 'ui.sortable', 'ngCookies'])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/login.html',
                controller: 'loginCtrl'
            })
            .when('/signup', {
                templateUrl: 'views/signUp.html',
                controller: 'signupCtrl'
            })
            .when('/dashboard', {
                templateUrl: 'views/dashboard.html',
                controller: 'dashboardCtrl'
            })
            .when('/:teamId', {
                templateUrl: 'views/teamView.html',
                controller: 'teamViewCtrl'
            })
            /*.when(':teamId',{
             templateUrl:'views/teamView.html',
             controller:'teamViewCtrl'
             })*/
            .otherwise({redirectTo: '/'});
    });