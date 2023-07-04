const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
const axios = require("axios")

const {User} = require('../models/users.model')
const errorLogger = require('../logs/errorLogger')
dotenv.config()

const auth = async(req,res,next)=>{
    try {
        const token = req.header("Authorization")
        console.log(token) 
        let payload = undefined
        await axios.get("http://192.168.2.31:3000/auth/user",{
            headers:{
                'Authorization': `${token}`
            }
        }).then((response)=>{
            payload = response.data
            console.log(response.data)
        }).catch((error)=>{
            console.log(error)
        })
        res.send(payload)
        // const decoded = jwt.verify(token, process.env.JWT_SECRET.toString('base64'),{ algorithms: ['HS256'] });
        // console.log(decoded)
        // const user = await User.findOne({where:{_id:decoded.sub}})
        // if(!user){
        //     throw new Error()
        // }
        // req.user = user
        //next()
    } catch (error) {
        errorLogger.error({url:req.url,statuscode:401,method:req.method, error:error})
        res.status(401).send(error)
        console.log(error)
    }
}

const javaAuthCall = async(token)=>{
    return new Promise((resolve,reject)=>{
        axios.get('http://192.1682.2.31:3000/api/test/user',{
            headers:{
                'Authorization': `${token}`
            }
        }).then((response)=>{
            resolve(response.data)
        }).error((error)=>{
            reject(error)
        })
    })
}

module.exports = auth
