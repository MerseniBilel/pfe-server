const router = require('express').Router();
const Project = require('../models/Project');
const Event = require('../models/Event');
const auth = require('../middleware/auth');

//get all event
router.get('/',auth, async (req,res) =>{
    try {
        const response = await Event.find().populate('theuser');
        res.send(response);
    }catch(error){
        console.log(error)
    }
      
});

// post an event
router.post('/',auth, async (req,res) =>{
    

    const {taskdescription , theuser} = req.body
    let isEventExist = await Event.findOne({taskdescription});
    if(!isEventExist){
        myevent = new Event({
            taskdescription,
            theuser
        })
    
        try {
            await myevent.save();
            res.send(myevent);        
        }catch(error){
            console.log(error);
        }
    }else {
        console.log('alredy exist' + taskdescription);
        
    }
});

//update finished task
router.post('/update',auth, async (req,res) =>{
    console.log(req.body)
    try {
        const response = await Event.findOneAndUpdate({ taskdescription : req.body.taskdescription },{ finishdate: req.body.finishdate }, {new : true});
        res.send(response);
    } catch (error) {
        console.log(error);
    }
      
});

module.exports = router;