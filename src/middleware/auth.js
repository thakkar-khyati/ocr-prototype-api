const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")

const {User} = require('../models/users.model')
const errorLogger = require('../logs/errorLogger')
dotenv.config()

const auth = async(req,res,next)=>{
    try {
        const token = req.header("Authorization").split(" ")[1];
        console.log(token)
        const decoded = jwt.verify(token, process.env.JWT_SECRET.toString('base64'),{ algorithms: ['HS256'] });
        console.log(decoded)
        const user = await User.findOne({where:{_id:decoded.sub}})
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