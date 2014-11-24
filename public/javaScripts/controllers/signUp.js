angular.module('panaReporter')
    .controller('signUpCtrl',function($scope,$http,$location,$rootScope){
        $scope.signUp=function(user){
            $http.post('signUp/signUp',user).success(function(data){
                console.log(JSON.stringify(data));
                if(data.code==11000){
                    alert('Email already Exist')
                }
                else{
                    alert('Welcome To PanaReporter');
                    $rootScope.currentUser=data;
                    $location.url('/dashboard');
                }
            })
                .error(function(data){
                    //alert(data);
                    console.log(data);
                })
        }
    });