var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var reportSchema = new Schema({
    teamId:{type:Schema.ObjectId,ref:'Team'},
    userId:{type:Schema.ObjectId,ref:'User'},
    reports:[{questions:String,answers:String}],
    submitDate:Date
    /*reportDate:Date*/
});

//to identify that the user isn't sending report again in the day
reportSchema.index({userId:1,reportDate:1,teamId:1},{unique:true});

var Report= mongoose.model('Report',reportSchema);

// rejected Schema
/*var reportSchema2 = new Schema({
    teamId:{ type: Schema.ObjectId, ref: 'Team'},
    reports:[{userId:String,report:[{question:String,answer:String}],submitDate:Date}],
    reportDate:Date
});*/
