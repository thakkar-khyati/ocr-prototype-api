const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const cluster = require("node:cluster");
const os = require("os");
const socketio = require("socket.io")
const http = require("http")

const totalCPUs = os.cpus().length;

const client = require("./src/eureka");
const userRouter = require("./src/routes/users.routes");
const javaApiCall = require("./src/controllers/socket.controller")
const logger = require("./src/logs/logger")
const errorLogger = require("./src/logs/errorLogger")

dotenv.config();
const app = express();

app.use("/", userRouter);
const server = http.createServer(app)
client.start();

app.use(
  cors({
    origin: [
      "http://192.168.2.84:3000",
      "http://localhost:3000",
      "http://192.168.2.79:8999",
      "http://localhost:8999",
      "http://192.168.2.79:8761",
      "http://localhost:8761",
      "http://192.168.2.42:3000"
    ],
    methods:'GET,POST,PATCH,PUT,DELETE',
    allowedHeaders:'Content-Type, Content-Type, Authorization'
    // origin:'*'
  })
  );

const io = socketio(server, {
  cors: {
      origin:  [
        "http://192.168.2.84:3000",
        "http://localhost:3000",
        "http://192.168.2.79:8999",
        "http://localhost:8999",
        "http://192.168.2.79:8761",
        "http://localhost:8761",
        "http://192.168.2.42:3000"
      ],
      methods: ["GET", "POST", "DELETE"]
  }
});

io.on("connection",(socket)=>{
  console.log("client connected with ",socket.id)
  logger.info({
    message:`socket connected with ${socket.id}`,
    socketID:socket.id,
    ip:socket.ip
  })
  socket.on("java_api_request",async (data,callback)=>{
    try {
      callback("Process started")
      logger.info({
        message:"process started with java api",
        socketID: socket.id,
        ip:socket.ip
      })
      const response = await javaApiCall()
      logger.info({
        message:"process started with java api",
        socketID: socket.id,
        ip:socket.ip,
        response:response
      })
      socket.emit('respose',response)
    } catch (error) {
      console.log("java api request denied for ",socket.id)
      errorLogger.error({
        message:`java api request denied for ${socket.id}`,
        socketID:socket.id,
        ip:socket.ip,
        error:error
      })
    }
  })
  socket.on('disconnect',()=>{
    console.log("client disconnected for ",socket.id)
    logger.info({
      message:`socket disconnected with ${socket.id}`,
      socketID:socket.id,
      ip:socket.ip
    })
  })
})

app.use(bodyParser.json());

const port = process.env.PORT;

if (cluster.isMaster) {
  for (let i = 0; i < totalCPUs; i++) {
    cluster.fork();
  }
} else {
  // app.listen(port, () => {
  //   console.log(`server running on ${port}, with pid of ${process.pid}`);
  // });
  server.listen(port,()=>{
    console.log(`server running on ${port}, with pid of ${process.pid}`)
  })
}
