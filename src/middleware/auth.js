const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")

const {User} = require('../models/users.model')
const errorLogger = require('../logs/errorLogger')
dotenv.config()

const auth = async(req,res,next)=>{
    try {
        const token = req.header("Authorization").split(" ")[1];
        console.log(token)
        // console.log(typeof(token))
        // token = token.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({where:{_id:decoded._id}})
        if(!user){
            throw new Error()
        }
        req.user = user
        next()
    } catch (error) {
        errorLogger.error({url:req.url,statuscode:401,method:req.method, error:error})
        res.status(401).send(error)
        console.log(error)
    }
}

module.exports = auth