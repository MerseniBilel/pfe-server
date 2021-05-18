const mongoose = require('mongoose');
var Schema = mongoose.Schema;
//create project model

const projectSchema = mongoose.Schema({
  projectName: {
    type: String,
    required:true
  },
  projectDesc: {
    type: String,
    required: true
  },
  projectOwner:{
      type:Schema.Types.ObjectId,
      ref:'user'
    },
  team:[{
    type:Schema.Types.ObjectId,
    ref:'user'
  }],
  started:{
    type: Boolean,
    default: false, 
  },
  creationDate:{
    type: Date,
    default: Date.now
  },
  tasks:{
    type:[
      {
        task:String,
        completed:Boolean,
        periority:String,
        completedDate:Date
      }
    ]
  }
});


module.exports = Project = mongoose.model('project',projectSchema);