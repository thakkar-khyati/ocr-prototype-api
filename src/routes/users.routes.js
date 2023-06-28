const express = require("express");

const auth = require("../middleware/auth")
const {
  createUser,
  getAllUser,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/users.controller");

const userRouter = express.Router();

userRouter.post("/", createUser);

userRouter.get("/", getAllUser);

userRouter.get("/:id",getUserById)

userRouter.patch("/:id", updateUser);

userRouter.delete("/:id", deleteUser);

module.exports = userRouter;
