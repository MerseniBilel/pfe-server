// get the total user number
// get the total projects number
//get the project that the status are pending (mezelou mabdawech)
//list all the projects
const PDFGenerator = require('pdfkit')
const fs = require('fs')
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
        const userNumber = await User.count();
        const projectNumber = await Project.count();
        const pendingProjects = await Project.count({started : false})
        const allProjects = await Project.find().populate('projectOwner',['name','lastname','avatar','email'])
    
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

// post request 
// body should be 
/*
    {
        action : generate
        cdr : all events 
    }
*/
route.post('/', auth, async (req,res) =>{
    
    // instantiate the library
    let theOutput = new PDFGenerator 
    
    // pipe to a writable stream which would save the result into the same directory
    theOutput.pipe(fs.createWriteStream('./pfe-client/public/uploads/test.pdf'))
    
    // add in a local image and set it to be 250px by 250px
    theOutput.image('./pfe-client/public/uploads/csi.png', { fit: [60,60] })
    
    theOutput.text('List of events happend in the last 30 day', { 
        bold: true,
        underline: true,
        align: 'center',
    })
    
    // write out file
    theOutput.end()
    res.send('end');
});


module.exports = route

