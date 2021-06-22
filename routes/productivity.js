const router = require('express').Router();
const Project = require('../models/Project');
const User = require('../models/User');
const auth = require('../middleware/auth');
const axios = require('axios');

//for decoding the token 
const dotenv = require('dotenv');
dotenv.config();

// @route GET   api/productivity
// @desc        get the number of the finished tasks of that user
// @access      private
router.get('/teammember/:id',auth, async (req,res)=>{
    try {
        const finihedTasks = await Project.count({
            "tasks.teamMember" : req.params.id,
            "tasks.completed" : true
        });
        const notfinihedTasks = await Project.count({
            "tasks.teamMember" : req.params.id,
            "tasks.completed" : false
        });
        res.send({finihedTasks,notfinihedTasks});
    } catch (error) {
        console.log(error)
    }
    
    
});

router.get('/',auth, async (req,res)=>{
   
  
});

module.exports = router;
