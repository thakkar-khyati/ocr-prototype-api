const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const cluster = require("node:cluster");
const os = require("os");

const totalCPUs = os.cpus().length;

const logger = require('./src/logs/logger')
const client = require("./src/eureka");
const userRouter = require("./src/routes/users.routes");

dotenv.config();
const app = express();
//client.start()

// app.use((req,res,next)=>{
//   logger.info({url:req.url, statuscode:req.complete, method:req.method})

//   next()
// })

app.use(
  cors({
  origin: ["http://192.168.2.84:3000", "http://localhost:3000"], 
  })
);

app.use(bodyParser.json());

app.use("/", userRouter);

const port = process.env.PORT;

if (cluster.isMaster) {
  for (let i = 0; i < totalCPUs; i++) {
    cluster.fork();
  }
} else {
  app.listen(port, () => {
    console.log(`server running on ${port}, with pid of ${process.pid}`);
  });
}
