var mongoose = require('mongoose');
var Schema = mongoose.Schema;
/*var reportSettings1 = new Schema({
    questions:[{question:String,isDefault:Boolean}],
    // value of
     d aysForReminderMails & daysForReportMail
    //will be array of 0 to 6
    // which will represent sunday to saturday
    daysForReminderMails:[Number],
    daysForReportMail:[Number],
    timeForReminderMails:{type:Number,min:00,max:23},
    timeForReportMails:{type:Number,min:00,max:23}
});*/
var TeamSchema = new Schema({
    name:String,
    members: [{ type: Schema.ObjectId, ref: 'User', default:[]}],
    admin:{ type: Schema.ObjectId, ref: 'User',required:true },
    teamId:{type:String,unique:true},
    //teamSettings:[teamSettings],
    reportSettings:{
        questions:[{question:String,isDefault:Boolean}],
        // value of daysForReminderMails & daysForReportMail
        //will be array of 0 to 6
        // which will represent sunday to saturday
        daysForReminderMail:[Boolean,Boolean,Boolean,,Boolean,Boolean,Boolean,Boolean],
        daysForReportMail:[Boolean,Boolean,Boolean,,Boolean,Boolean,Boolean,Boolean],
        timeForReminderMail:{type:Number,min:00,max:23},
        timeForReportMail:{type:Number,min:00,max:23}
    }
});
var Team = mongoose.model('Team',TeamSchema);


//var RepSet=mongoose.model('ReportSettings',reportSettings);
