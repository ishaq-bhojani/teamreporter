angular.module('panaReporter')
    .controller('signupCtrl', function ($scope, $timeout, $cookies, $http, $location, $rootScope) {
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
        $scope.signup = function (user) {
            $http.post('/signUp', user).success(function (data) {
                console.log(JSON.stringify(data));
                if (data.code == 11000) {
                    $scope.addAlert('Email already Exist', 'danger')
                }
                else {
                    $scope.addAlert('Welcome To PanaReporter', 'info');
                    $rootScope.currentUser = data;
                    $cookies.user = data._id;
                    $cookies.myName = data.name;
                    $location.url('/dashboard');
                }
            })
                .error(function (err) {
                    $scope.addAlert('Error in SignUp' + err, 'info');
                    console.log(err);
                })
        }
    });