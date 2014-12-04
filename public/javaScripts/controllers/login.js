angular.module('panaReporter')
    .controller('loginCtrl', function ($scope,$cookies, $http, $location, $rootScope) {
        $scope.login = function (user) {
            $http.post('/login', user).success(function (data) {
                if (data !== 'null') {
                    console.log(JSON.stringify(data));
                    $rootScope.currentUser = data;
                    $cookies.user=data._id;
                    console.log($cookies.user);
                    $location.url('/dashboard')
                }
                else {
                    console.log(typeof data);
                    console.log(data);
                    alert('Wrong Email or Password');
                }

            })
                .error(function (data) {
                    console.log(data);
                })
        }
    });