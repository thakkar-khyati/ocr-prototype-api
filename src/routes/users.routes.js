const express = require("express");

const auth = require("../middleware/auth")
const {
  createUser,
  getAllUser,
  getUserById,
  updateUser,
  deleteUser,
  loginUser,
  logoutUser
} = require("../controllers/users.controller");

const userRouter = express.Router();

userRouter.post("/users", createUser);

userRouter.get("/users", getAllUser);

userRouter.get("/users/:id",getUserById)

userRouter.patch("/users/:id", updateUser);

userRouter.delete("/users/:id", deleteUser);

//userRouter.post("/users/login", loginUser);

// userRouter.post("/users/logout",logoutUser)

module.exports = userRouter;
