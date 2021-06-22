const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const fileupload = require("express-fileupload");
dotenv.config();
const PORT = process.env.PORT || 3001;
const app = express();

//init medelwares
app.use(express.json({extended : false}));
// Add headers
app.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    // Pass to next layer of middleware
    next();
});
app.use(fileupload());
app.use(express.static("files"));

//Connect to db
mongoose.connect(process.env.DB_PATH, {useNewUrlParser: true, useUnifiedTopology:true,useCreateIndex:true },)
.then(() => console.log("Connected to database"))
.catch(err => console.log(err));


//define routes
app.use('/api/user', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projs', require('./routes/projects'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/fetchadmin', require('./routes/fetchAdminDashboardData'));
app.use('/api/v2/mobile', require('./routes/mobileapp'));
app.use('/api/event', require('./routes/events'));
app.use('/api/productivity', require('./routes/productivity'));





//start server
app.listen(PORT,()=>console.log(`SERVER STARTED AT PORT ${PORT}`) );
