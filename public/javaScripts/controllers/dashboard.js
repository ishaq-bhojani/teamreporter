angular.module('panaReporter')
    .controller('dashboardCtrl',function($scope,$http,$location,$rootScope, $modal){
        if(!$rootScope.currentUser){
            $location.url('/');
        }
        $scope.open = function (size) {
            var modalInstance=$modal.open({
                templateUrl: 'myModalContent.html',
                controller: 'ModalInstanceCtrl',
                size: size
            });
        };

    })
    .controller('ModalInstanceCtrl', function ($scope,$modalInstance,$http,$rootScope,$location){
        if(!$rootScope.currentUser){
            $location.url('/');
        }
        $scope.team={
            name:"",
            teamId:""
        };
        $scope.$watch('team.name', function() {
            $scope.team.teamId = $scope.team.name.toLowerCase().replace(/[^\w\s]/gi,'-').replace(/\s+/g,'-');
        });
        $scope.num=1;
        $scope.addTeamReq=function(crtUser,teamName,teamId){
            $scope.teamIdInc=$scope.team.teamId+$scope.num++;
            $http.post('dashboard/createNewTeam',{
                creator:crtUser,
                teamName:teamName,
                teamId:teamId
            }).success(function(data){
                console.log(data);
                if(data._id){
                    $rootScope.currentUser.myTeams.push(data);
                    alert("Team Adding Success Your Team ID is "+ data.teamId);
                }
                else{
                    if(data.code==11000){
                        console.log($scope.teamIdInc);
                        $scope.addTeamReq($rootScope.currentUser._id,$scope.team.name,$scope.teamIdInc);
                    }
                    else{
                        console.log(data);
                    }
                }

            }).error(function(err){
                console.log("Error creating Team "+err);
            })
        };
        $scope.ok = function () {
            $modalInstance.close();
            $scope.addTeamReq($rootScope.currentUser._id,$scope.team.name,$scope.team.teamId);
        };
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });