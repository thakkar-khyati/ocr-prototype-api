const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")

const {User} = require('../models/users.model')

dotenv.config()

const auth = async(req,res,next)=>{
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({where:{_id:decoded._id}})
        if(!user){
            throw new Error()
        }
        req.user = user
        next()
    } catch (error) {
        res.send(error)
        console.log(error)
    }
}

module.exports = auth