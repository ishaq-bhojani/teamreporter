angular.module('panaReporter')
    .controller('dashboardCtrl', function ($scope, $http, $location, $rootScope, $modal, $cookies) {
        if ($cookies.user != null) {
            $http.get('/login')
                .success(function (data) {
                    console.log(data);
                    if (data._id) {
                        $rootScope.currentUser = data;
                        $cookies.user = data._id;
                        $cookies.myName = data.name;
                        console.log($cookies.user);
                    }
                })
                .error(function (err) {
                    $location.url('/');
                })
        }
        else {
            $location.url('/');
        }
        $scope.userName = $cookies.myName;
        $scope.open = function (size) {
            var modalInstance = $modal.open({
                templateUrl: 'myModalContent.html',
                controller: 'ModalInstanceCtrl',
                size: size
            });
        };
        $scope.logout = function () {
            $location.url('/');
            $cookies.user = null;
            $cookies.team = null;
            $rootScope.thisTeam = null;
            $rootScope.thisReports = null;
            $rootScope.currentUser = null;

        };
    })
    .controller('ModalInstanceCtrl', function ($scope, $cookies, $modalInstance, $timeout, $http, $rootScope, $location) {
        if ($cookies.user == null) {
            $location.url('/');
        }
        $scope.team = {
            name: "",
            id: ""
        };
        $scope.teamDuplicate = false;
        $scope.$watch('team.teamId', function () {
            $scope.teamDuplicate = false;
            $scope.team.teamId = $scope.team.teamId.toLowerCase().replace(/[^\w\s]/gi, '.').replace(/\s+/g, '-');
        });
        $scope.$watch('team.name', function () {
            $scope.team.teamId = $scope.team.name.toLowerCase().replace(/[^\w\s]/gi, '.').replace(/\s+/g, '-');
        });
        $scope.alerts = [];
        $scope.addAlert = function (msg, type) {
            $scope.alerts.push({msg: msg, type: type});
            $timeout(function () {
                $scope.alerts.splice(0, 1);
            }, 3000);
        };
        $scope.addTeamReq = function (team) {
            $http.post('dashboard/team', {
                creator: $rootScope.currentUser._id,
                teamName: team.name,
                teamId: team.teamId
            }).success(function (data) {
                if (data._id) {
                    $modalInstance.close();
                    $rootScope.currentUser.myTeams.push(data);
                    $scope.addAlert("Team Created ", 'success');
                }
                else {
                    if (data.code == 11000) {
                        $scope.teamDuplicate = true;
                    }
                }

            }).error(function (err) {
                $scope.addAlert("Error creating Team " + err, 'danger');
            })
        };
        $scope.ok = function (team) {
            $scope.addTeamReq(team);
        };
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };
    });