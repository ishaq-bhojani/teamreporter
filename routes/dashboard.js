var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Team = mongoose.model('Team');
var Report = mongoose.model('Report');
router.get('/:teamId', function (req, res) {
    if (req.cookies.user) {
        Team.findOne({
            teamId: req.param('teamId')
        }).populate('members', 'name email')
            .populate('admin', 'name email').exec(
            function (err, data) {
                if (err) {
                    res.json(err)
                }
                else {
                    if (data != null) {
                        if(req.cookies.user == data.admin._id){
                            res.send(data);
                        }
                        else{
                            for(var i=0;i<data.members.length;i++){
                                if(req.cookies.user == data.members[i]._id){
                                    delete data.reportSettings;
                                    res.send(data);
                                    break;
                                }
                                res.send(null)
                            }
                        }
                    }
                    else {
                        res.send(null)
                    }
                }
            }
        )
    }

});
router.post('/addMember', function (req, res) {
    Team.findOne(req.cookies.myTeam).exec(function (err, teamData) {
        if (!err) {
            if (teamData.admin == req.cookies.user) {
                var user = new User({
                    email: req.body.email,
                    password: '12345',
                    name: req.body.name,
                    memberOf: [req.cookies.myTeam],
                    myTeams: []
                });
                user.save(function (err, userData) {
                    if (err) {
                        res.send(err);
                    }
                    else {
                        teamData.members.push(userData._id);
                        teamData.save(function (err, data) {
                            if (err) {
                                console.log(err)
                            }
                            else {
                                res.send(true);
                            }
                        })
                    }

                });
            }
        }

    });


});
router.put('/submitReport', function (req, res) {
    var dateTime = new Date();
    var day = dateTime.getDay();
    var dayArray = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var date = dateTime.getDate();
    var month = dateTime.getMonth();
    var monthsArray = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    var year = dateTime.getFullYear();
    //Tuesday, December 16, 2014
    var finalDate = dayArray[day] + ', ' + monthsArray[month] + ' ' + date + ', ' + year;
    var hours = dateTime.getHours();
    var minutes = dateTime.getMinutes();
    var finalTime = hours + ':' + minutes;
    var objToSubmit={
        teamId: req.cookies.myTeam,
        userId: req.cookies.user,
        reports: req.body.reports,
        submitDate: finalDate,
        submitTime: finalTime
    };
    if (req.cookies.myTeam && req.cookies.user) {
        Report.findByIdAndUpdate(req.body.reportId,objToSubmit)
                    .exec(function (err, reportdata) {
                        if (err) {
                            res.send(err)
                        }
                        else {
                            res.json(reportdata);
                        }
                    });
            }

});
router.post('/submitReport', function (req, res) {
    var dateTime = new Date();
    var day = dateTime.getDay();
    var dayArray = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    var date = dateTime.getDate();
    var month = dateTime.getMonth();
    var monthsArray = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];
    var year = dateTime.getFullYear();
    //Tuesday, December 16, 2014
    var finalDate = dayArray[day] + ', ' + monthsArray[month] + ' ' + date + ', ' + year;
    var hours = dateTime.getHours();
    var minutes = dateTime.getMinutes();
    var finalTime = hours + ':' + minutes;
    if (req.cookies.myTeam && req.cookies.user) {
        var subReport = new Report({
            teamId: req.cookies.myTeam,
            userId: req.cookies.user,
            reports: req.body.reports,
            submitDate: finalDate,
            submitTime: finalTime
        });
        subReport.save(function (err, data) {
            if (err) {
                res.send(err)
            }
            else {
                //res.send(data);
                Report.findById(data._id)
                    .populate('userId', 'name email')
                    .exec(function (err, reportdata) {
                        if (err) {
                            res.send(err)
                        }
                        else {
                            res.json(reportdata);
                        }
                    });
            }
        })
    }
    else {
        res.send(false);
    }

});
router.post('/findReport', function (req, res) {
    if (!req.cookies.myTeam) {
        res.end("not found");
        return;
    }
    Report.find({submitDate: req.body.date, teamId: req.cookies.myTeam})
        .populate('userId', 'name')
        .exec(function (err, data) {
            if (err) {
                res.send(err)
            }
            else {
                res.json(data);
            }
        })
});
router.post('/findOneReport', function (req, res) {
    if (!req.cookies.myTeam) {
        res.end("not found");
        return;
    }
    Report.findOne({submitDate: req.body.date, teamId: req.cookies.myTeam, userId:req.cookies.user})
        .exec(function (err, data) {
            if (err) {
                res.send(err)
            }
            else {
                res.json(data);
            }
        })
});
router.post('/team', function (req, res) {
    var team = new Team({
        name: req.body.teamName,
        admin: req.cookies.user,
        teamId: req.body.teamId,
        reportSettings: {
            questions: [{
                question: "What did you accomplish today?",
                isDefault: true
            }, {
                question: "What will you do tomorrow?",
                isDefault: true
            }, {
                question: "What obstacles are impeding your progress?",
                isDefault: true
            }],
            daysForReminderMail: [false, true, true, true, true, true, true],
            daysForReportMail: [false, true, true, true, true, true, true],
            timeForReminderMail: 0,
            timeForReportMail: 0

        }
    });
    team.save(function (err, teamData) {

        if (err) {
            res.send(err);
        } else {
            var teamId = teamData._id;
            User.findById(req.body.creator).exec(function (err, userData) {
                if (err) {
                    console.log(err)
                } else {
                    userData.myTeams.push(teamId);
                    userData.save(function (err, data) {
                        res.json({
                            _id: teamData._id,
                            name: teamData.name,
                            teamId: teamData.teamId
                        });
                    })
                }
            });
        }

    })
});
router.put('/team', function (req, res) {
    delete req.body.admin;
    delete req.body.members;
    Team.findOne({_id: req.cookies.myTeam})
        .exec(
        function (err, data) {
            if (err) {
                res.send(err)
            }
            else {
                if (data.admin == req.cookies.user) {
                    Team.findByIdAndUpdate(req.cookies.myTeam, req.body)
                        .populate('admin', 'name email')
                        .populate('members', 'name email')
                        .exec(function (err, data) {
                            if (err) {
                                res.send(err);
                            } else {
                                res.json(data);
                            }
                        })
                }
            }
        })
    /*Team.findByIdAndUpdate(req.body._id, req.body)
     .populate('admin', 'name email')
     .populate('members', 'name email')
     .exec(function (err, data) {
     if (err) {
     res.send(err);
     } else {
     res.json(data);
     }
     })*/
});
router.post('/teamDelete', function (req, res) {
    Team.findByIdAndRemove(req.cookies.myTeam, function (err) {
        if (err) {
            res.send(err);
        } else {
            User.findOne(req.cookies.user)
                .exec(function (err, data) {
                    if (err) {
                        res.send(err)
                    }
                    else {
                        res.json(data);
                    }
                });
        }
    })
});
module.exports = router;