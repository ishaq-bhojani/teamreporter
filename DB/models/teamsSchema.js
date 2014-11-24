var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TeamSchema = new Schema({
    name:String,
    members: [{ type: Schema.ObjectId, ref: 'User', default:[]}],
    admin:{ type: Schema.ObjectId, ref: 'User',required:true }
    //teamSettings:[teamSettings],
    //reportSettings:reportSettings
});
var Team= mongoose.model('Team',TeamSchema);

var reportSettings = new Schema({
        questions:[{question:String,isDefault:Boolean}],
        // value of daysForReminderMails & daysForReportMail
        //will be array of 0 to 6
        // which will represent sunday to saturday
        daysForReminderMails:[Number],
        daysForReportMail:[Number],
        timeForReminderMails:{type:Number,min:00,max:23},
        timeForReportMails:{type:Number,min:00,max:23}
});
