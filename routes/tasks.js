const router = require('express').Router();
const { check, validationResult } = require('express-validator');
const Project = require('../models/Project');
const User = require('../models/User');
const auth = require('../middleware/auth');

/*
const filter = { name: 'Jean-Luc Picard' };
const update = { age: 59 };

// `doc` is the document _before_ `update` was applied
let doc = await Character.findOneAndUpdate(filter, update);
*/



// @route get   api/tasks
// @desc        upadte project and add tasks
// @access      private
router.get('/:id', auth, async (req,res) =>{
   
});


// @route get   api/tasks
// @desc        get all tasks
// @access      private
router.get('/',auth, async (req,res) =>{
   
});



