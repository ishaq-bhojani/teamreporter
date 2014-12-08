angular.module('panaReporter')
    .controller('loginCtrl', function ($scope, $cookies, $timeout, $http, $location, $rootScope) {
        if ($cookies.user !== 'null') {
            $http.get('/login')
                .success(function (data) {
                    console.log(data);
                    if (data._id) {
                        $rootScope.currentUser = data;
                        $cookies.user = data._id;
                        $cookies.myName = data.name;
                        console.log($cookies.user);
                        $location.url('/dashboard')
                    }
                })
                .error(function (err) {

                })
        }
        $scope.alerts = [];
        $scope.addAlert = function (msg, type) {
            $scope.alerts.push({msg: msg, type: type});
            $timeout(function () {
                $scope.alerts.splice(0, 1);
            }, 3000);
        };
        $scope.login = function (user) {
            $http.post('/login', user).success(function (data) {
                if (data !== 'null') {
                    $rootScope.currentUser = data;
                    $cookies.user = data._id;
                    $cookies.myName = data.name;
                    console.log($cookies.user);
                    $location.url('/dashboard')
                }
                else {
                    console.log(typeof data);
                    console.log(data);
                    $scope.addAlert('Wrong Email or Password', 'danger');
                }

            })
                .error(function (data) {
                    $scope.addAlert('Error in Login ' + data, 'danger');
                    console.log(data);
                })
        }
    });