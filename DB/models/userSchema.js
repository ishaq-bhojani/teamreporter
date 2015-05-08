var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    email: {type: String, unique: true},
    password: {type: String, select: false},
    name: String,
    myTeams: [{type: Schema.ObjectId, ref: 'Team', default: []}],
    memberOf: [{type: Schema.ObjectId, ref: 'Team', default: [

    ]}]
});

var User = mongoose.model('User', UserSchema);