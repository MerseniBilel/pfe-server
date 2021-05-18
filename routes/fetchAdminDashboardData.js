// get the total user number
// get the total projects number
//get the project that the status are pending (mezelou mabdawech)
//list all the projects


const route = require('express').Router();
const User =  require('../models/User');
const Project = require('../models/Project');
const dotenv = require('dotenv');
const auth = require('../middleware/auth');
dotenv.config();
KEY = process.env.KEY || 'pfepfe'; 

//@route    GET    /api/fetch-admin-dashboard-data
//@desc     get all data for dashboard admin home   get all data admin needs to the home page 
//@access          Private;
route.get('/', auth, async (req,res) =>{

    /*
    project name
    project status
    project Owner email
    project owner name lastname
    project date
    */ 

    try {
        console.log("we got a request")
        const userNumber = await User.count();
        const projectNumber = await Project.count();
        const pendingProjects = await Project.count({started : false})
        const allProjects = await Project.find().populate('projectOwner',['name','lastname','avatar','email'])
        console.log(allProjects)
    
        const response = {
            usersNumber : userNumber,
            projectsNumber:projectNumber,
            notStartedProjectsNumber : pendingProjects,
            allProjects : allProjects
        }
        return res.send(response);
        
    } catch (error) {
        return res.status(500).send("server error");
    }
    

});


module.exports = route