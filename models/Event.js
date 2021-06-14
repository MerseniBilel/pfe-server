const mongoose = require('mongoose');
var Schema = mongoose.Schema;

//create event model

const eventSchema = mongoose.Schema({
    taskdescription:String,
    theuser : 
        {
            type:Schema.Types.ObjectId,
            ref:'user'
        },
    startedate :
        {
            type:Date,
            default:Date.now
        },
    finishdate : Date
});


module.exports = Events = mongoose.model('event',eventSchema);