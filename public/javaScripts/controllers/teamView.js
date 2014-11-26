angular.module('panaReporter')
    .controller('teamViewCtrl',function($scope,$http,$location,$rootScope,$routeParams) {
        //$rootScope.currentUser
        if(5==5){

        $http.get("/dashboard/"+$routeParams.teamId)
            .success(function(data){
                console.log(data);
                $rootScope.thisTeam=data;
                $scope.daysArray = $rootScope.thisTeam.reportSettings.daysForReminderMail;
                $scope.days=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
            })
            .error(function(err){
            console.log(err);
            });
            //$rootScope.thisTeam.reportSettings=$rootScope.thisTeam.reportSettings;

        $scope.tickOnDay=function(idx,val){
            alert('working');
            alert(idx+""+val);
        };
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
    })
    .filter('range', function() {
        return function(input, min, max) {
            min = parseInt(min); //Make string input int
            max = parseInt(max);
            for (var i=min; i<max; i++)
                input.push(i);
            return input;
        };
    });