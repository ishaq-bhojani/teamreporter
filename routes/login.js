var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Team = mongoose.model('Team');
var Report= mongoose.model('Report');
router.post('/login', function(req,res) {
    console.log('1');
    User.find(req.body,function(err,userData){
          if(err){
            console.log('Error'+ err);
            res.send(false);
              console.log('2');
          }
          else{
              //userData.populate("myTeams").exec(function)
              Team.find({admin:userData._id},function(err,teamDataForAdmin){
                  if(err){
                      console.log('3');
                      console.log(err);
                      res.json(userData);
                  }
                  else{
                      console.log('4');
                     Team.find({members:userData._id},function(err,teamDataForMember){
                         if(err){
                             console.log('5');
                             console.log(err);
                             res.json({userData:userData,teamDataForAdmin:teamDataForAdmin})
                         }
                         else{
                             console.log('6');
                             res.json({userData:userData,teamDataForAdmin:teamDataForAdmin,teamDataForMember:teamDataForMember})
                         }})
                  }
              });
          }
  });

});
router.get('/abc',function(req,res){
   res.send("Hello World")
});
module.exports = router;