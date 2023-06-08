const { where } = require('sequelize')
const { User, getAuthToken, encodePassword, findByCredentials } = require('../models/users.model')

const createUser = async(req,res)=>{
    try {
        const { first_name, last_name, email,password } = req.body
        const user = await User.create({
            first_name,
            last_name,
            email,
            password
        })
        const enUser = await encodePassword(user.password,user._id)
        res.send(enUser)
    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

const getAllUser = async(req,res)=>{
    try {
        const users = await User.findAll()
        res.send(users)
    } catch (error) {
        res.send(error)
        console.log(error)
    }
}

const getLoggedInUser = async(req,res)=>{
    try {
        const user = req.user
        res.send(user)
    } catch (error) {
        res.send(error)
        console.log(error)
    }
}

const updateUser = async(req,res)=>{
    try {
        const _id = req.params.id
        await User.update(req.body,{where:{_id:_id}})
        const user = await User.findByPk(_id)
        res.send(user)
    } catch (error) {
        res.send(error)
        console.log(error)
    }
}

const deleteUser = async(req,res)=>{
    try {
        const _id = req.params.id
        await User.destroy({where:{_id:_id}})
        res.send("deleted")
    } catch (error) {
        res.send(error)
        console.log(error)
    }
}

// const deleteMe = async(req,res)=>{
//     try {
//         console.log(req.user)
//         const _id = req.user._id
//         await User.destroy({where:{_id:_id}})
//         res.send("deleted")
//     } catch (error) {
//         res.send(error)
//         console.log(error)
//     }
// }

const loginUser = async(req,res)=>{
    try {
        let user = await findByCredentials(req.body.email,req.body.password)
        user = await getAuthToken(user._id)
        res.send(user)
    } catch (error) {
        res.send(error)
        console.log(error)
    }
}

const logoutUser = async(req,res)=>{
    try {
        let user = await findByCredentials(req.body.email,req.body.password)
        await User.update({token:''},{where:{_id:user._id}})
        user = await User.findByPk(user._id)
        res.send(user)
    } catch (error) {
        res.send(error)
        console.log(error)
    }
}

module.exports = {
    createUser,
    getAllUser,
    getLoggedInUser,
    updateUser,
    deleteUser,
    loginUser,
    logoutUser
}