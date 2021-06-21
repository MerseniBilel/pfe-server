const router = require('express').Router();
const { check, validationResult } = require('express-validator');
const Project = require('../models/Project');
const User = require('../models/User');
const auth = require('../middleware/auth');
const axios = require('axios');

//for decoding the token 
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

// @route post   api/projects
// @desc        insert into project collection
// @access      private
router.post('/', async (req,res) =>{
  
  const {projectName, projectDesc, projectOwner, selectedValue, tasks, started } = req.body

  
  // create a new project object
  project = new Project({
    projectName,
    projectDesc,
    tasks,
    started
  });

  const team = selectedValue.split(",");

  const ProjectOwnerInformations = await User.findById(projectOwner)
  project.projectOwner = ProjectOwnerInformations

  const teamMembers = await Promise.all(team.map( async (t)=>{
    return await User.findById(t);
  }));

  project.team = teamMembers
 
 
  
  const file = req.files.file;
  const filepath = `http://localhost:3000/uploads/${file.name}`;
  file.mv(`${__dirname}/../pfe-client/public/uploads/${file.name}`, err => {
      if (err) {
          console.log(err);
          return res.status(500).send(err);
      }
  });

  project.projectFile = filepath;

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




// @route GET   api/project/{id}
// @desc        get a project by id
// @access      private
router.get('/:id',auth, async (req,res) => {
  try{
    /*
      projectDescription {
        projectname,
        project description,
        project owner,
        project team,
        project tasks
        
      }
    */

    response =  await Project.findById(req.params.id).populate(['projectOwner','team']);

    res.send(response);
  }catch(error){

    return res.status(500).send('server error'); 
  }
  
})

// @route DELETE   api/project/{id}
// @desc        delete the project 
// @access      private
router.delete('/:id',auth, async (req,res) => {
  try{
    const response =  await Project.findOneAndDelete({_id : req.params.id});
    res.send(response);
  }catch(error){
    console.log(error);
  }
  
})

// @route UPDATE   api/project/{id}
// @desc        update the project 
// @access      private
router.put('/:id',auth, async (req,res) => {
  try{
    const updatestatus = await Project.findOneAndUpdate({_id:req.params.id},{started : true}, {new: true});
    res.send(updatestatus);
  }catch(error){
    console.log(error);
  }
  
})
// @route UPDATE task   api/project/updatetask/{id}
// @desc        update the project 
// @access      private
router.put('/task/:id',auth, async (req,res) => {
  try{
    const updatestatus = await Project.updateOne(
      {"tasks._id" : req.params.id},
      {
        "$set" : {'tasks.$.completed': true}
      }
    )
    
    res.send(updatestatus);
  }catch(error){
    console.log(error);
  }
  
})

module.exports = router;
