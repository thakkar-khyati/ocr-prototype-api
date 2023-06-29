const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");
const socketio = require("socket.io");
const http = require("http");

const logger = require("./src/logs/infoLogger");
const errorLogger = require("./src/logs/errorLogger");
const { javaApiCall } = require("./src/controllers/socket.controller");

const { client1 } = require("./src/eureka");
const userRouter = require("./src/routes/users.routes");
const paymentRouter = require("./src/routes/payment.routes");

const Roles = require("./src/models/user.roles.model")

dotenv.config();
const app = express();

app.use(bodyParser.json());
app.use("/users", userRouter);
app.use("/payment", paymentRouter);
const server = http.createServer(app);
// client1.start();


app.use(
  cors({
    origin: process.env.cors_ip,
    methods: "GET,POST,PATCH,PUT,DELETE",
    allowedHeaders: "Content-Type, Content-Type, Authorization",
  })
);

const io = socketio(server, {
  cors: {
    origin: [
      "http://192.168.2.84:3000",
      "http://localhost:3000",
      "http://192.168.2.79:8999",
      "http://localhost:8999",
      "http://192.168.2.79:8761",
      "http://localhost:8761",
      "http://192.168.2.42:3000",
    ],
    methods: ["GET", "POST", "DELETE"],
  },
});

io.on("connection", (socket) => {
  console.log("client connected with ", socket.id);
  logger.info({
    message: `socket connected with ${socket.id}`,
    socketID: socket.id,
  });
  socket.on("java_api_request", async (data, callback) => {
    try {
      callback("Process started");
      logger.info({
        message: "process started with java api",
        socketID: socket.id,
      });
      const response = await javaApiCall();
      logger.info({
        message: "process started with java api",
        socketID: socket.id,
        response: response,
      });
      socket.emit("response", response);
    } catch (error) {
      console.log("java api request denied for ", socket.id);
      errorLogger.error({
        message: `java api request denied for ${socket.id}`,
        socketID: socket.id,
        error: error,
      });
    }
  });
  socket.on("disconnect", () => {
    console.log("client disconnected for ", socket.id);
    logger.info({
      message: `socket disconnected with ${socket.id}`,
      socketID: socket.id,
      ip: socket.ip,
    });
  });
});

port1 = process.env.PORT1;
port2 = process.env.PORT2;
port3 = process.env.PORT3;
port4 = process.env.PORT4;


server.listen(port1,()=>{
  console.log(`server and web socket running on ${port1}`)
})

server.listen(port2,()=>{
  console.log(`server and web socket running on ${port2}`)
})

server.listen(port3,()=>{
  console.log(`server and web socket running on ${port3}`)
})

server.listen(port4,()=>{
  console.log(`server and web socket running on ${port4}`)
})


module.exports = io;
