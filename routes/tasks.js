const router = require('express').Router();
const Project = require('../models/Project');
const auth = require('../middleware/auth');
const { response } = require('express');







// @route get   api/tasks
// @desc        get all tasks
// @access      private
router.get('/:id',auth, async (req,res) =>{
  try {
    const response = await Project.find({_id : req.params.id},{tasks : 1, team : 1}).populate(['projectOwner','team']);
    
    const initialData = [
      {
        id : response[0].projectOwner._id ,
        user : response[0].projectOwner.email,
        tasks : []
      }
    ];

    response[0].team.map(myteam =>{
      var element = {
        id : myteam._id ,
        user : myteam.email,
        tasks : []
      };
      initialData.push(element);

    })

    
    response[0].tasks.map( mytasks => {
      var index = initialData.findIndex(x => x.id == mytasks.teamMember.toString());
      var element = {
        id:mytasks._id,
        teskTitle:mytasks.task,
        deadline : mytasks.deadline,
        content: mytasks.description,
        periority : mytasks.periority,
        completed : mytasks.completed 
     }
      if (index === -1){
        initialData[0].tasks.push(element);
      }else{
        initialData[index].tasks.push(element);
      }
    });

    res.send(initialData);

  } catch (error) {
    console.log(error);
    res.status(500).send('error fetching data from tasks');
  }
    
});


// @route get   api/tasks
// @desc        add task
// @access      private
router.post('/',auth, async (req,res) =>{

    const {task,description,periority,deadline, projectId, projectOwner} = req.body;
    const tasks = {
        task,
        description,
        periority,
        deadline,
        teamMember : projectOwner
    }
    try{
        const response = await Project.findOneAndUpdate({_id : projectId}, { $push: { tasks: tasks } }, {new: true});
        res.send(response);
    }catch(err){
        res.status(500).send('cannot add this task');
        console.log(err);
    }
});


// @route get   api/tasks
// @desc        update task ( add the member who's going to complete this task )
// @access      private
router.put('/',auth, async (req,res) =>{
   
  try {
    const response = await Promise.all(req.body.map( async user => {
      await Promise.all(user.tasks.map(async tt => {
        const res = await Project.updateOne(
          {"tasks._id" : tt.id},
          {
            "$set" : {'tasks.$.teamMember': user.id}
          }
        )
      }));
    } ));
  } catch (error) {
    console.log(error)
  }

});

// @route get   api/tasks
// @desc        get single task by id
// @access      private
router.get('/task/:id',auth, async (req,res) =>{
   
  try {
    const response = await Project.find({_id : req.params.id},{tasks : 1});
    res.send(response)
  } catch (error) {
    console.log(error)
  }

});


module.exports = router;
