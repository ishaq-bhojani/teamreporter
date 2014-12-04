var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Team = mongoose.model('Team');

router.get('/', function (req, res) {
    res.render('index', {title: 'Express'});
});
/*

 router.get('/createteam', function(req, res) {
 var team = new Team({
 name:'Team3',
 admin:'546c9542a1085d300c683c6d'
 });
 team.save(function(err,data){
 if(err){
 res.json(err);
 }
 else{
 var teamId = data._id;
 User.findById('546c9542a1085d300c683c6d').exec(function(err,data){
 if(err){
 res.json(err);
 }
 else{
 data.myTeams.push(teamId);
 data.save(function(err,data){
 if(err){
 res.json(err);
 }
 else{
 res.json(data);
 }
 });
 }
 })


 }
 })

 });
 */


module.exports = router;
