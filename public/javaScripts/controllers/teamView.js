angular.module('panaReporter')
    .controller('teamViewCtrl', function($scope, $http, $location, $rootScope, $routeParams) {
        //$rootScope.currentUser
        if (5==5) {
            $http.get("/dashboard/"+$routeParams.teamId)
                .success(function(data) {
                    if(data.teamData._id){
                        console.log(data);
                        $rootScope.thisTeam=data.teamData;
                        $rootScope.thisReports=data.reports;
                        $scope.daysArray=$rootScope.thisTeam.reportSettings.daysForReminderMail;
                        $scope.days=['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                }
                else{
                        $location.url('/dashboard');
                        alert('Requested Team not Found');
                    }
                })
                .error(function(err) {
                    console.log(err);
                });
            $scope.addMember=function(memberData){
                $http.post('dashboard/addMember',{
                    team:$rootScope.thisTeam._id,
                    data:memberData
                }).success(function(data){
                    if(data){
                        console.log(data);
                        alert('Invitation Email Sent');
                    }
                }).error(function(err) {
                    alert('Error in Adding Member ' + err);
                })
            };
            $rootScope.logout=function(){
                $rootScope.thisTeam=null;
                $rootScope.thisReports=null;
                $rootScope.currentUser=null;
                $location.url('/');
            };
            $scope.submitReport=function(data){
                console.log(data);
                /*$scope.sampleObj={
                    teamId:$rootScope.thisTeam._id,
                    userId:$rootScope.currentUser._id,
                    reports:data
                }*/
            };
            $scope.saveChanges = function() {
                $http.put('dashboard/team', $rootScope.thisTeam).success(function(data) {
                    $rootScope.thisTeam = data;
                    alert('Changes Saved');
                }).error(function(err) {
                    alert('Error in Changes Saving ' + err);
                })
            };
            $scope.deleteTeam = function() {
                var ask=confirm("Your All Team Data & Members will delete?");
                if(ask){
                $http.delete('dashboard/team'+$rootScope.thisTeam._id)
                    .success(function(data) {
                        if(data=='true'){
                         $rootScope.thisTeam='';
                         alert('Team Deleted');
                         $location.url('/dashboard')
                         }
                    }).error(function(err) {
                        alert('Error in deleting team ' + err);
                    })}
            };
            $scope.deleteThisQuestion = function(indx) {
                if ($rootScope.thisTeam.reportSettings.questions[indx].isDefault) {
                    alert("This is a Default Question so it can't be delete :(");
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