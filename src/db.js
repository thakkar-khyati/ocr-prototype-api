const { Sequelize} = require('sequelize')
const dotenv = require('dotenv')

dotenv.config()

// const sequelize = new Sequelize({
//     dialect:'postgres',
//     host: process.env.SEQ_HOST,
//     port:process.env.SEQ_PORT,
//     database:'ocr',
//     username: process.env.SEQ_USERNAME,
//     password:process.env.SEQ_PASSWORD,
//     storage:'path/to/database.sqllite',
//     logging:false,
//     pool:{
//         max:5,
//         min:0,
//         acquire:30000,
//         idle:10000
//     },
// })

const sequelize = new Sequelize("test",'postgres','postgres',{
    host:'localhost',
    port:5432,
    dialect:'postgres',
    pool:{
        max:5,
        min:0,
        acquire:30000,
        idle:10000
    },
    storage:'path/to/database.sqllite',
})


sequelize.authenticate().then(()=>{
    console.log("Database connection established and models synchronized.")
}).catch((error)=>{
    console.log("Error connecting to database",error)
})

module.exports = sequelize