const mongoose = require('mongoose');

//create event model

const productivitySchema = mongoose.Schema({
    monthname:String,
    Pending : {
        type : Number,
        default : 0
    },
    completed : {
        type : Number,
        default: 0
    }

});


module.exports = Productivity = mongoose.model('productivity',productivitySchema);
/*
["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
*/