const express = require("express")
const dotenv = require("dotenv")
const bodyParser = require("body-parser")
const cors = require("cors")

const client = require('./src/eureka')
const userRouter = require("./src/routes/users.routes")

dotenv.config()
const app = express()
client.start()

app.use(bodyParser.json())

app.use('/',userRouter)

const port = process.env.PORT || 3001
app.listen(port ,()=>{
    console.log("server running on ",port)
})