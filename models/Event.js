const mongoose = require('mongoose');
var Schema = mongoose.Schema;

//create event model

const eventSchema = mongoose.Schema({
    eventTitle: {
        type: String,
        required:true
    },
    eventDate: {
        type: Date,
        default: Date.now
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref:'user'
    },
});


module.exports = Events = mongoose.model('event',eventSchema);