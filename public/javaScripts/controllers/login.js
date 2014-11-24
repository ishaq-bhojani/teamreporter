angular.module('panaReporter')
.controller('loginCtrl',function($scope,$http,$location,$rootScope){
        $scope.login=function(user){
            $http.post('login/login',user).success(function(data){
                if(data.userData!=false){
                    console.log(JSON.stringify(data));
                    $rootScope.currentUser=data;
                    $location.url('/dashboard')
                }
                else{
                    alert('Wrong Email or Password');
                }

            })
                .error(function(data){
                    //alert(data);
                    console.log(data);
                })
        }
    });