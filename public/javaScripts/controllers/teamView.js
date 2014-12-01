angular.module('panaReporter')
    .controller('teamViewCtrl', function($scope, $http, $location, $rootScope, $routeParams,$timeout) {
        //$rootScope.currentUser
        if (5==5) {
            $http.get("/dashboard/"+$routeParams.teamId)
                .success(function(data) {
                    if(data.teamData){
                        console.log(data);
                        $rootScope.thisTeam=data.teamData;
                        $rootScope.thisReports=data.reports;
                        $scope.daysArray=$rootScope.thisTeam.reportSettings.daysForReminderMail;
                        $scope.days=['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                }
                else{
                        $location.url('/dashboard');
                        $scope.addAlert('Requested Team not Found','danger');
                    }
                })
                .error(function(err) {
                    console.log(err);
                });
            $scope.alerts=[];
            $scope.addAlert = function(msg,type) {
                $scope.alerts.push({msg: msg,type:type});
                $timeout(function(){
                    $scope.alerts.splice(0,1);
                },3000);
            };
            $scope.addMember=function(memberData){
                $http.post('dashboard/addMember',{
                    team:$rootScope.thisTeam._id,
                    data:memberData
                }).success(function(data){
                    if(data){
                        console.log(data);
                        $scope.addAlert('Invitation Email Sent','info');
                    }
                }).error(function(err) {
                    $scope.addAlert('Error in Adding Member ' + err,'danger');
                })
            };
            $rootScope.logout=function(){
                $rootScope.thisTeam=null;
                $rootScope.thisReports=null;
                $rootScope.currentUser=null;
                $location.url('/');
            };
            $scope.submitReport=function(data){
                    $http.post('dashboard/submitReport', {
                        teamId: $rootScope.thisTeam._id,
                        userId: $rootScope.currentUser._id,
                        reports: data
                    })
                        .success(function (data) {
                            if(data.code==11000){
                                $scope.addAlert('You Cant Submit Report again in a Day','danger');
                            }
                            else{
                                $rootScope.thisReports.push(data);
                            }
                        })
                        .error(function (err) {
                            console.log(err);
                        });
            };
            $scope.saveChanges = function() {
                $http.put('dashboard/team', $rootScope.thisTeam).success(function(data) {
                    $rootScope.thisTeam = data;
                    $scope.addAlert('Changes Saved','success');
                }).error(function(err) {
                    $scope.addAlert('Error in Changes Saving ' + err,'danger');
                })
            };
            $scope.deleteTeam = function() {
                var ask=confirm("Your All Team Data & Members will delete?");
                if(ask){
                $http.delete('dashboard/team'+$rootScope.thisTeam._id)
                    .success(function(data){
                        if(data=='true'){
                         $rootScope.thisTeam='';
                            $scope.addAlert('Team Deleted','success');
                            $location.url('/dashboard')
                         }
                    }).error(function(err) {
                        $scope.addAlert('Error in deleting team ' + err,'danger');
                    })
                }
            };
            $scope.deleteThisQuestion = function(indx) {
                if ($rootScope.thisTeam.reportSettings.questions[indx].isDefault) {
                    $scope.addAlert("This is a Default Question so it can't be delete",'danger');
                } else {
                    $rootScope.thisTeam.reportSettings.questions.splice(indx, 1);
                }
            };
            $scope.sortableOptions = {
                axis: 'y'
            };
            $scope.addquesPlace = "Add Question text";
            $scope.addQuestions = function(value) {
                if (!value) {
                    $scope.addquesPlace = "Please Write Something";
                } else {
                    $rootScope.thisTeam.reportSettings.questions.push({
                        question: value,
                        isDefault: false
                    });
                }
            }
        } else {
            $location.url('/');
        }
    })
    .filter('range', function() {
        return function(input, min, max) {
            min = parseInt(min); //Make string input int
            max = parseInt(max);
            for (var i = min; i < max; i++)
                input.push(i);
            return input;
        };
    });