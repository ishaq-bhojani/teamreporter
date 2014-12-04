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
                        res.send(data);
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
    Team.findOne(req.cookies.team).exec(function (err, teamData) {
        if (!err) {
            if (teamData.admin._id == req.cookies.user) {
                var user = new User({
                    email: req.body.data.email,
                    password: '12345',
                    name: req.body.data.name,
                    memberOf: [req.cookies.team],
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
    if (req.cookies.team && req.cookies.user) {
        var subReport = new Report({
            teamId: req.cookies.team,
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
    Report.find({submitDate: req.body.date})
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
                        console.log(data);
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
    Team.findByIdAndUpdate(req.body._id, req.body)
        .populate('admin', 'name email')
        .populate('members', 'name email')
        .exec(function (err, data) {
            if (err) {
                res.send(err);
            } else {
                res.json(data);
            }
        })
});
router.delete('/team:id', function (req, res) {
    Team.findByIdAndRemove(req.param('id'), function (err) {
        if (err) {
            res.send(err);
        } else {
            res.send(true);
        }
    })
});
module.exports = router;