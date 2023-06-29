const express = require("express");

const auth = require("../middleware/auth")
const {
  createUser,
  getAllUser,
  getUserById,
  updateUser,
  deleteUser,
  forgetPassword,
  userForResetPassword,
  resetPassword
} = require("../controllers/users.controller");

const userRouter = express.Router();

userRouter.post("/", createUser);

userRouter.get("/", getAllUser);

userRouter.get("/:id",getUserById)

userRouter.patch("/:id", updateUser);

userRouter.delete("/:id", deleteUser);

userRouter.post("/forget-password",forgetPassword)

userRouter.get("/reset-password/:id/:token",userForResetPassword)

userRouter.patch("/reset-password/:id",resetPassword)

module.exports = userRouter;
