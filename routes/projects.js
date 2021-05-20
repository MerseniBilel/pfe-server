const router = require('express').Router();
const { check, validationResult } = require('express-validator');
const Project = require('../models/Project');
const User = require('../models/User');
const auth = require('../middleware/auth');


//for decoding the token 
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// @route post   api/projects
// @desc        insert into project collection
// @access      private
router.post('/',[
  check('projectName','Project Name is required').not().isEmpty(),
  check('projectDesc','project description is required').not().isEmpty(),
  check('team','Team is required as an array').isArray(),
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
    tasks,
    started
  });


  const ProjectOwnerInformations = await User.findById(projectOwner)
  project.projectOwner = ProjectOwnerInformations

  const teamMembers = await Promise.all(team.map( async (t)=>{
    return await User.findById(t._id)
  }))

  project.team = teamMembers

  

/* by id mat7otech { } */


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
router.get('/',auth, async (req,res)=>{
  const token = req.header('x-auth-token');

  try{
    const decoded = jwt.verify(token,process.env.KEY);
    userRole = decoded.user.role
    userId = decoded.user.id
  }catch{
    return res.status(500).send('server error');  
  }

  
  if(userRole == 0){
    // if the user is an admin get all the startde and not started projects
    try {
      const startedPorjects = await Project.find({started:true}).populate(['projectOwner','team'])
      const notStartedProjects = await Project.find({started:false}).populate(['projectOwner','team'])
      const projects = {
        startedPorjects : startedPorjects,
        notStartedProjects : notStartedProjects
      }
      res.send(projects);
      
    } catch (error) {
      console.log(error);
      return res.status(500).send('server error');  
    }
  }else if (userRole == 1 ){
    // if the user is project owner get only the project of that user
    try{
      const ProjectOwnerstartedProjects = await Project.find({projectOwner:userId, started:true}).populate(['projectOwner','team']);
      const ProjectOwnerNotstartedProjects = await Project.find({projectOwner:userId, started:false}).populate(['projectOwner','team']);
      const projects = {
        startedPorjects : ProjectOwnerstartedProjects,
        notStartedProjects : ProjectOwnerNotstartedProjects
      }
      res.send(projects);
    }catch(error){
      console.log(error);
      return res.status(500).send('server error'); 
    }


  }else if (userRole == 2){
    // if the user is a team member get only the projects he involved in
    try{
      const teamMemberstartedProjects = await Project.find({team:userId, started:true}).populate(['projectOwner','team']);
      const teamMemberNotstartedProjects = await Project.find({team:userId, started:false}).populate(['projectOwner','team']);
      const projects = {
        startedPorjects : teamMemberstartedProjects,
        notStartedProjects : teamMemberNotstartedProjects
      }
      res.send(projects);
    }catch(error){
      console.log(error);
      return res.status(500).send('server error'); 
    }

  }else{
    return res.status(500).send('server error'); 
  }

});






module.exports = router;
