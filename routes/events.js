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


/*
[
    {
        id: '1',
        title: 'All-day event',
        start: '2021-06-11',
        end : '2021-06-13'
    },
]

[
  {
    _id: 60d230d7cd9d58133cd63846,
    taskdescription: 'Create a login page',
    theuser: 60d226b6d78552406c74b657,
    startedate: 2021-06-22T18:49:59.557Z,
    __v: 0
  },
]
*/

//get specific event 
router.get('/:id',auth, async (req,res) =>{
    try {
        const response = await Event.find({theuser : req.params.id})
        const eventtable = response.map(e => {
            return {
                id: e._id,
                title: e.taskdescription,
                start: e.startedate,
                end : e.finishdate == undefined ?  e.startedate : e.finishdate
            }
        });
        res.send(eventtable);
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

router.get('/',auth, async (req,res) =>{

      
});

module.exports = router;