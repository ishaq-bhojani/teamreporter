var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Team = mongoose.model('Team');
var Report= mongoose.model('Report');
router.post('/', function(req,res) {
    User.findOne({email:req.body.email,password:req.body.password})
        .populate('myTeams','name teamId')
        .populate('memberOf','name teamId')
        .exec(function(err,data){
            if(err){
                console.log(err);
            }
            else{
                res.json(data);
            }

    });
});
router.get('/abc',function(req,res){
   res.send("Hello World")
});
module.exports = router;