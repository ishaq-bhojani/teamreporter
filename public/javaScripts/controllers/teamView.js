angular.module('panaReporter')
    .controller('teamViewCtrl', function ($scope, $http, $cookies, $timeout, $location, $rootScope, $routeParams) {
        //$rootScope.currentUser
        if ($cookies.user != null) {
            $http.get("/dashboard/" + $routeParams.teamId)
                .success(function (data) {
                    if (data._id) {
                        if ($cookies.user != null) {
                            $http.get('/login')
                                .success(function (data) {
                                    console.log(data);
                                    if (data._id) {
                                        $rootScope.currentUser = data;
                                        $cookies.user = data._id;
                                        $cookies.myName = data.name;
                                    }
                                })
                                .error(function (err) {
                                    $location.url('/');
                                })
                        }
                        else {
                            $location.url('/');
                        }
                        $rootScope.thisTeam = JSON.parse(JSON.stringify(data));
                        $scope.sampleObj = JSON.parse(JSON.stringify(data));
                        $cookies.myTeam = data._id;
                        //$scope.reportOfDate=new Date();
                        //$scope.getReportOf($scope.reportOfDate);
                        $scope.days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                        $scope.userName = $cookies.myName;
                        $rootScope.thisTeam.admin._id !== $cookies.user ? $scope.isNotAdmin = true : $scope.isNotAdmin = false;
                    }
                    else {
                        $location.url('/dashboard');
                        $scope.addAlert('Requested Team not Found', 'danger');
                    }
                })
                .error(function (err) {
                    $scope.addAlert('Requested Team not Found ' + err, 'danger');
                });
            $scope.alerts = [];
            $scope.addAlert = function (msg, type) {
                $scope.alerts.push({msg: msg, type: type});
                $timeout(function () {
                    $scope.alerts.splice(0, 1);
                }, 3000);
            };

            $scope.months = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"];
            $scope.getReportOf = function (reportOfDate) {
                $scope.showButton = false;
                var day = reportOfDate.getDay();
                var date = reportOfDate.getDate();
                var month = reportOfDate.getMonth();
                var year = reportOfDate.getFullYear();
                //Tuesday, December 16, 2014
                $scope.finalDate = $scope.days[day] + ', ' + $scope.months[month] + ' ' + date + ', ' + year;
                $http.post('dashboard/findReport', {date: $scope.finalDate})
                    .success(function (data) {
                        console.log(data);
                        $rootScope.thisReports = data;
                        $scope.showReport=true;
                    })
                    .error(function (err) {
                        $scope.addAlert("Sorry we Can't find the Reports" + err, 'danger')
                    });

            };

            //
            $scope.showButton = false;
            $scope.showReport=false;
            $scope.addMember = function (memberData) {
                console.log(memberData);
                $http.post('dashboard/addMember', memberData
                ).success(function (data) {
                        if (data) {
                            $scope.addAlert('Invitation Email Sent', 'info');
                        }
                    }).error(function (err) {
                        $scope.addAlert('Error in Adding Member ' + err, 'danger');
                    })
            };
            $scope.showButtonOrNot = function () {
                $scope.showReport=false;
                var reportOfDate = new Date();
                var day = reportOfDate.getDay();
                var date = reportOfDate.getDate();
                var month = reportOfDate.getMonth();
                var year = reportOfDate.getFullYear();
                //Tuesday, December 16, 2014
                var finalDate = $scope.days[day] + ', ' + $scope.months[month] + ' ' + date + ', ' + year;
                $http.post('dashboard/findOneReport', {date: finalDate})
                    .success(function (data) {
                        $scope.showButton = true;
                        $scope.reportEditMode = true;
                        if (data) {
                            $scope.reportId = data._id;
                            $scope.demoReport = data.reports;
                            console.log(data);
                        }
                        else {
                            $scope.demoReport = [];
                            for (var i = 0; i < $rootScope.thisTeam.reportSettings.questions.length; i++) {
                                $scope.demoReport.push({
                                    answers: "", questions: $rootScope.thisTeam.reportSettings.questions[i].question
                                })
                            }
                        }
                    })
                    .error(function (err) {
                        $scope.addAlert("Sorry we are having some problems " + err, 'danger')
                    });

            };
            $scope.logout = function () {
                $cookies.user = null;
                $cookies.myTeam = null;
                $rootScope.thisTeam = null;
                $rootScope.thisReports = null;
                $rootScope.currentUser = null;
                $location.url('/');
            };
            $scope.editReport = function (data) {
                $scope.getReportOf(new Date());
                $http.put('dashboard/submitReport', {
                    reports: data, reportId: $scope.reportId
                })
                    .success(function (data) {
                        $scope.getReportOf(new Date());
                    })
                    .error(function (err) {
                        $scope.addAlert("Sorry Something went wrong " + err, 'danger');
                    });
            };
            $scope.submitReport = function (data) {
                console.log(data);
                $http.post('dashboard/submitReport', {
                    reports: data
                }).success(function (data) {
                    $scope.getReportOf(new Date());
                })
                    .error(function (err) {
                        $scope.addAlert("Sorry we can't Submit your Report " + err, 'danger');
                    });
            };
            $scope.saveChanges = function () {
                if ($rootScope.thisTeam.admin._id == $rootScope.currentUser._id) {
                    $http.put('dashboard/team', $scope.sampleObj).success(function (data) {
                        $rootScope.thisTeam = data;
                        $scope.sampleObj = data;
                        $scope.addAlert('Changes Saved', 'success');
                    }).error(function (err) {
                        $scope.addAlert('Error in Changes Saving ' + err, 'danger');
                    })
                }
                else {
                    $scope.addAlert('Only Admin can Make the Changes', 'Danger');
                }

            };
            $scope.deleteTeam = function () {
                var ask = confirm("Your All Team Data & Members will delete?");
                if (ask) {
                    $http.post('dashboard/teamDelete', {})
                        .success(function (data) {
                            if (data._id) {
                                $cookies.myTeam = null;
                                $location.url('/dashboard');
                                $rootScope.thisTeam = '';
                                $rootScope.currentUser = data;
                                $scope.sampleObj = '';
                                $scope.addAlert('Team Deleted', 'success');
                            }
                        }).error(function (err) {
                            $scope.addAlert('Error in deleting team ' + err, 'danger');
                        })
                }
            };
            $scope.deleteThisQuestion = function (indx) {
                if ($scope.sampleObj.reportSettings.questions[indx].isDefault) {
                    $scope.addAlert("This is a Default Question so it can't be delete", 'danger');
                } else {
                    $scope.sampleObj.reportSettings.questions.splice(indx, 1);
                }
            };
            $scope.sortableOptions = {
                axis: 'y'
            };
            $scope.addquesPlace = "Add Question text";
            $scope.addQuestions = function (value) {
                if (!value) {
                    $scope.addquesPlace = "Please Write Something";
                } else {
                    $scope.sampleObj.reportSettings.questions.push({
                        question: value,
                        isDefault: false
                    });
                }
            }
        } else {
            $location.url('/');
        }
    });