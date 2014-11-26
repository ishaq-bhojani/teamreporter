angular.module('panaReporter')
    .controller('teamViewCtrl',function($scope,$http,$location,$rootScope,$routeParams) {
        //$rootScope.currentUser
        if(5==5){

        $http.get("/dashboard/"+$routeParams.teamId)
            .success(function(data){
                console.log(data);
                $rootScope.thisTeam=data;
            })
            .error(function(err){
            console.log(err);
            });
        $scope.deleteThisQuestion=function(indx){
            if($rootScope.thisTeam.reportSettings.questions[indx].isDefault){
                alert("This is a Default Question so it can't be delete :(");
            }
            else {
                $rootScope.thisTeam.reportSettings.questions.splice(indx, 1);
            }
        };
            $scope.sortableOptions = {
                axis: 'y'
            };
            $scope.addquesPlace="Add Question text";
        $scope.addQuestions=function(value){
            if(!value){
                $scope.addquesPlace="Please Write Something";
            }
            else{
                $rootScope.thisTeam.reportSettings.questions.push({
                question:value,
                isDefault:false
            });
            }
        }
    }
        else{
            $location.url('/');
    }
    });