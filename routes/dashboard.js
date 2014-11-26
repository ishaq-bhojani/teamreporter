var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Team = mongoose.model('Team');
var Report = mongoose.model('Report');
//var RepSet=mongoose.model('ReportSettings');
router.get('/:teamId',function(req,res){
        console.log(req.param('teamId'));
    Team.findOne({teamId:req.param('teamId')}).exec(
        function(err,data){
            if(err){
                res.send(err);
            }
            else{
                res.json(data);
            }
        }
    )
});
router.post('/createNewTeam', function(req, res) {

    /*var repSet={
        questions:[
             {question:"What did you accomplish today?",isDefault:true}
            ,{question:"What will you do tomorrow?",isDefault:true}
            ,{question:"What obstacles are impeding your progress?",isDefault:true}],
        daysForReminderMail:[false,true,true,true,true,true,true],
        daysForReportMail:[false,true,true,true,true,true,true],
        timeForReminderMail:10,
        timeForReportMail:20

    };*/
    var team = new Team({
        name:req.body.teamName,
        admin:req.body.creator,
        teamId:req.body.teamId,
        reportSettings:{
            questions:[
                {question:"What did you accomplish today?",isDefault:true}
                ,{question:"What will you do tomorrow?",isDefault:true}
                ,{question:"What obstacles are impeding your progress?",isDefault:true}],
            daysForReminderMail:[false,true,true,true,true,true,true],
            daysForReportMail:[false,true,true,true,true,true,true],
            timeForReminderMail:0,
            timeForReportMail:0

        }
    });
        team.save(function(err,teamData){

        if(err) {
            res.send(err);
        }
            else{
            var teamId=teamData._id;
            User.findById(req.body.creator).exec(function(err,userData){
               if(err){
                   console.log(err)
               }
                else{
                   userData.myTeams.push(teamId);
                   userData.save(function(err,data){
                       console.log(data);
                       res.json({_id:teamData._id,name:teamData.name,teamId:teamData.teamId});
                   })
               }
            });
        }

    })
});
module.exports = router;