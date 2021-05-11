const router = require('express').Router();
const { check, validationResult } = require('express-validator');
const Project = require('../models/Project');



// @route post   api/projects
// @desc        insert into project collection
// @access      private
router.post('/',[
  check('projectName','Project Name is required').not().isEmpty(),
  check('projectDesc','project description is required').not().isEmpty(),
  check('projectOwner','Project owner email is required').isEmail(),
  check('team','Team is required as an array').isArray(),
  check('tasks','Team is required as an array').isArray(),
], async (req,res) =>{
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).send({ errors : errors.array()});
  }
  
  const { projectName, projectDesc, projectOwner, team, tasks, started} = req.body

  // create a new project object
  project = new Project({
    projectName,
    projectDesc,
    projectOwner,
    team,
    tasks,
    started
  });

  try {
    await project.save();
    res.send({project});
  } catch (error) {
    return res.status(500).send('Server Error');
  }

});






// @route GET   api/project
// @desc        get all projects in the collection
// @access      private
router.get('/', async (req,res)=>{
  try {
    const allproject = await Project.find();
    res.send(allproject);
    
  } catch (error) {
    console.log(error);
    return res.status(500).send('server error');  
  }
});





module.exports = router;
