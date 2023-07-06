const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const cors = require("cors");

const path = require("path");

// const logger = require("./src/logs/infoLogger");
// const errorLogger = require("./src/logs/errorLogger");
// const { javaApiCall } = require("./src/controllers/socket.controller");

// const { client1 } = require("./src/eureka");
const userRouter = require("./src/routes/users.routes");

dotenv.config();
const app = express();

port1 = process.env.PORT1;
port2 = process.env.PORT2;
port3 = process.env.PORT3;
port4 = process.env.PORT4;

app.use(
  cors({
    origin: [
      "http://192.168.2.91:3000/",
      "http://192.168.2.91:3000",
      "http://localhost:3000",
    ],
    methods: ["GET,POST,PATCH,PUT,DELETE"],
  })
);
app.use(bodyParser.json());

app.use("/users", userRouter);
app.use("/users/images", express.static(path.join("images")));

// client1.start();

app.listen(port1, () => {
  console.log(`server and web socket running on ${port1}`);
});

app.listen(port2, () => {
  console.log(`server and web socket running on ${port2}`);
});

app.listen(port3, () => {
  console.log(`server and web socket running on ${port3}`);
});

app.listen(port4, () => {
  console.log(`server and web socket running on ${port4}`);
});
