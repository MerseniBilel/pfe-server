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

    await sleep(500)

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
                res.send({token,user});
            }
        );

    }catch(err){
        console.log(err);
        res.status(500).send("server error");
    }



});



route.get('/projects/:id',async (req,res)=> {
    try {
        const response = await Project.find({"team" : req.params.id},{started : 1 ,projectName : 1 , projectDesc : 1, projectOwner : 1}).populate('projectOwner');
        //const mytasks = await Project.find({"tasks.teamMember" : req.params.id},{tasks : 1});
        //const tasknumber = mytasks.tasks.filter(tt => tt.teamMember == req.params.id)

        res.send(response);
    } catch (error) {
        res.status(500).send('Server error')
    }

});

route.get('/tasks/:id',async (req,res)=> {
    try {
        const response = await Project.find({"team" : req.params.id},{tasks:1, _id:0})
        //const mytasks = await Project.find({"tasks.teamMember" : req.params.id},{tasks : 1});
        //const tasknumber = mytasks.tasks.filter(tt => tt.teamMember == req.params.id)
        var mytasks = [];

        response.map(tt => {
        tt.tasks.map(tsk => {
              if(tsk.teamMember == req.params.id){
                  mytasks.push(tsk);
              }
          });
        });
        res.send(mytasks);
    } catch (error) {
        res.status(500).send('Server error')
    }

});


route.get('/profile/:id',async (req,res)=> {
    try {
        const response = await User.find({_id : req.params.id});
        res.send(response[0]);
    } catch (error) {
        res.status(500).send('Server error')
    }

});

route.get('/desc',async (req,res)=> {
    try {
        const projectid = '60d22cbb36b4661e0ce77d48'
        const userid = '60d226b6d78552406c74b657'
        
        const response = await Project.find({_id : projectid},{tasks:1});
        const mytasks = response[0].tasks.filter(tsk => tsk.teamMember = userid);
        res.send(mytasks)
    } catch (error) {
        res.status(500).send('Server error')
    }

});



module.exports = route