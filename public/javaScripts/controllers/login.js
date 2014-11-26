angular.module('panaReporter')
.controller('loginCtrl',function($scope,$http,$location,$rootScope){
        $scope.login=function(user){
            $http.post('/login',user).success(function(data){
                if(data._id && data.name){
                    console.log(JSON.stringify(data));
                    $rootScope.currentUser=data;
                    $location.url('/dashboard')
                }
                else{
                    alert('Wrong Email or Password');
                }

            })
                .error(function(data){
                    console.log(data);
                })
        }
    });