const router = require('express').Router();
const Project = require('../models/Project');
const auth = require('../middleware/auth');
const Productivity = require('../models/Productivity');
const Event = require('../models/Event');
const fs = require('fs');
const PDFDocument = require('./pdfkit-tables');


//for decoding the token 
const dotenv = require('dotenv');
dotenv.config();

// @route GET   api/productivity
// @desc        get the number of the finished tasks of that user
// @access      private
router.get('/teammember/:id',auth, async (req,res)=>{
    try {
        const tasklist = await Project.find({
            "tasks.teamMember" : req.params.id
        },{_id:0, tasks:1});
        const mytask = tasklist[0].tasks.filter(tt => tt.teamMember == req.params.id)
        var completed = 0
        var pending = 0
        const myproductivity = mytask.map(pp => {

            if (pp.completed){
                completed++
            }else{
                pending++
            }
        })
        res.send({completed, pending});
    } catch (error) {
        console.log(error)
    }
    
    
});

router.get('/',auth, async (req,res)=>{
   try {
       const response = await Productivity.find().sort({ monthname : 1});
       var finishChart = {};
       var pendingChart = {};

       // fill the chart data 
       response.map(respon => {
        finishChart[respon.monthname] = respon.completed;
        pendingChart[respon.monthname] = respon.Pending;
       });

       res.send({finishChart,pendingChart});
   } catch (error) {
       console.log(error)
   }
  
});


router.get('/init',auth, async (req,res)=>{
    const monthes = ["January", "February", "March", "April", "May", "June","July", "August", "September", "October", "November", "December"];
    try {
        await Promise.all(monthes.map(async mm => {
            prod = new Productivity({
                monthname : mm
            });
            await prod.save();
        }));
        res.send({monthes, done : 'done!!'});
    } catch (error) {
        console.log(error)
    }
   
});

router.get('/pending',auth, async (req,res)=>{
    try {
        const monthname = new Date(Date.now()).toLocaleString('default', { month: 'long' });
        const response = await Productivity.findOneAndUpdate(
            {monthname : monthname},
            { $inc : {'Pending' : 1} },
            {new : true});
        res.send(response); 
    } catch (error) {
        console.log(error);
    }

});


router.get('/completed',auth, async (req,res)=>{
    const monthname = new Date(Date.now()).toLocaleString('default', { month: 'long' });
    try {
        const response = await Productivity.findOneAndUpdate(
            {monthname : monthname},
            { $inc : {'completed' : 1} },
            {new : true});
        res.send(response)
    } catch (error) {
        console.log(error);
    }

});

router.get('/generate',auth, async (req,res)=>{
    // generate pdf file
    const doc = new PDFDocument();


    try {
        doc.pipe(fs.createWriteStream('pfe-client/public/uploads/statistics.pdf'));
        doc
        .image("pfe-client/public/uploads/logo.png", 50, 45, { width: 50 })
        .fillColor("#444444")
        .fontSize(20)
        .text("CSI MAGHREB", 110, 57)
        .fontSize(10)
        .text("22 Rue Gustave Eiffel 78300 Poissy-​France", 200, 65, { align: "right" })
        .text("+33 751295785", 200, 80, { align: "right" })
        .text("Sales@csi-maghreb.com", 200, 95, { align: "right" })
        .moveDown();




        const table0 = {
            headers: ['eventId', 'Event', 'User', 'User Email', 'Date'],
            rows: []
        };

        //table0.rows.push([patient.name, patient.address, patient.phone, patient.birthday, patient.emailAddress, patient.bloodType, patient.height, patient.weight])
        const response = await Event.find({}).populate('theuser');
        for (const event of response) {
            table0.rows.push([ event._id, event.taskdescription, event.theuser.name+ '' + event.theuser.lastname, event.theuser.email, new Date(event.startedate).toLocaleDateString() + ' ' + new Date(event.startedate).toLocaleTimeString()  ])
        }

        doc.moveDown().table(table0, {
            prepareHeader: () => doc.font('Helvetica'),
            prepareRow: (row, i) => doc.font('Helvetica').fontSize(8)
        });


        doc.end();

        const sleep = (milliseconds) => {
            return new Promise(resolve => setTimeout(resolve, milliseconds))
        }
    
        await sleep(2000)
        res.send('done!!')
    } catch (error) {
        res.status(500).send('there is an error')
    }
    

});

module.exports = router;
