var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Team = mongoose.model('Team');
router.post('/', function (req, res) {
    var user = new User({
        email: req.body.email,
        password: req.body.password,
        name: req.body.name
    });
    user.save(function (err, data) {
        if (err) {
            res.send(err);
        }
        else {
            res.json(data);
        }
    })
});
module.exports = router;