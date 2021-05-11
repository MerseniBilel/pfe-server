const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();


module.exports = function(req,res,next){
    //get token from header
    const token = req.header('x-auth-token');

    //check if no token found
    if(!token){
        return res.status(401).send({errors : 'no token , authorization denied'});
    }

    //verify token
    try {
        const decoded = jwt.verify(token,process.env.KEY);
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).send({errors: 'token is not valid'});
    }
}