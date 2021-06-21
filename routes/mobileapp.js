const route = require('express').Router();
const {check, validationResult} = require('express-validator');
const User =  require('../models/User');
const Project = require('../models/Project');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
const dotenv = require('dotenv');
const auth = require('../middleware/auth');
dotenv.config();
KEY = process.env.KEY || 'pfepfe'; 


// @route   POST    api/mobileapp
// @desc    mobileapi    get all what the mobile app need
// login then return
//          - the web token
//          - all project the user envolved in using the token 
//          - all the taks of that user

// @access          public
route.post('/',[
    check('email','Please enter a valid email').isEmail(),
    check('password','Password is required').exists(),
],async (req,res)=> {

    const sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
      }

    await sleep(2000)

    const errors = validationResult(req);
    

    if(!errors.isEmpty()){
        return res.status(400).send({ errors : errors.array()});
    }
    const {email, password} = req.body; 

    
    try{
        let user = await User.findOne({email});
        if(!user){
            return res.status(400).send({ errors:[ {msg:'Invalid credentials'} ] });
        }

        const isMatched = await bcrypt.compare(password, user.password);
        if(!isMatched){
            return res.status(400).send({ errors:[ {msg:'Invalid credentials'} ] });
        }

        try{
            updatestatus = await User.findOneAndUpdate(
                {email:user.email},
                {active : true},
                {new : true}
            );
        }catch(err){
            console.log(err)
        }

        // get all project of the user 
        
        const allProjects = await Project.find({team:user.id}).populate(['projectOwner','team']);
        const teamMember  = allProjects[0].team.map(tt => {
            return {
                name : tt.name,
                lastname : tt.lastname,
                email:tt.email,
                avatar: tt.avatar
            }
        });

        const homepageData = allProjects.map(pp => {
            return {
                projectName : pp.projectName,
                projectDesc : pp.projectDesc,
                creationDate : pp.creationDate,
                projectOwner : {
                    name : pp.projectOwner.name,
                    lastname : pp.projectOwner.lastname,
                    avatar: pp.projectOwner.avatar,
                    email : pp.projectOwner.email,
                },
               team : teamMember
            }
        });


        const respomseData = {
            profile : user,
            data : homepageData,
        }

        const payload = {
            user:{
                id: user.id,
                role: user.role
            }
        }

        jwt.sign(
            payload,
            KEY,
            {expiresIn:"10h"},
            (err, token)=>{
                if(err) throw err;
                res.send({token,respomseData});
            }
        );

    }catch(err){
        console.log(err);
        res.status(500).send("server error");
    }



});

module.exports = route