var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Team = mongoose.model('Team');
var Report = mongoose.model('Report');
//var RepSet=mongoose.model('ReportSettings');
router.get('/:teamId', function(req, res) {
    console.log(req.param('teamId'));
    Team.findOne({
        teamId: req.param('teamId')
    }).populate('members','name email')
        .populate('admin','name email').exec(
        function(err, data) {
            if (err) {
                res.json({
                    teamData:data,
                    reports:err
                })
            } else {
                Report.find({teamId:data._id})
                    .populate('userId','name email')
                    .exec(function(err,reportsData){
                    res.json({
                        teamData:data,
                        reports:reportsData
                    })
                })

            }
        }
    )
});
router.post('/addMember', function(req, res) {
    var user = new User({
        email:req.body.data.email,
        password:'12345',
        name:req.body.data.name,
        memberOf:[req.body.team],
        myTeams:[]
    });
    user.save(function(err,userData){
        if(err){
            res.send(err);
        }
        else{
            Team.findOne(req.body.team).exec(function(err,data){
               if(!err){
                   data.members.push(userData._id);
               }data.save(function(err,data){
                    if(err){
                        console.log(err)
                    }
                    else{
                        res.send(true);
                    }
                });
            });

        }
    });

});
router.post('/team', function(req, res) {
    var team = new Team({
        name: req.body.teamName,
        admin: req.body.creator,
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
    team.save(function(err, teamData) {

        if (err) {
            res.send(err);
        } else {
            var teamId = teamData._id;
            User.findById(req.body.creator).exec(function(err, userData) {
                if (err) {
                    console.log(err)
                } else {
                    userData.myTeams.push(teamId);
                    userData.save(function(err, data) {
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
router.put('/team', function(req, res) {
    Team.findByIdAndUpdate(req.body._id, req.body)
        .exec(function(err, data) {
            if (err) {
                res.send(err);
            } else {
                res.json(data);
            }
        })
});
router.delete('/team:id', function(req, res) {
    Team.findByIdAndRemove(req.param('id'), function(err) {
        if (err) {
            res.send(err);
        } else {
            res.send(true);
        }
    })
});
module.exports = router;