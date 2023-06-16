const redis = require("redis");

const {
  User,
  getAuthToken,
  encodePassword,
  findByCredentials,
} = require("../models/users.model");

const logger = require("../logs/logger");
const errorLogger = require("../logs/errorLogger");

const utill = require("../utill");

const redisClient = redis.createClient()
const DEFAULT_EXPIRATION = 3600;
redisClient.on('error', err => console.log('Redis Client Error', err));

// redisClient.connect();

const createUser = async (req, res) => {
  try {
    const { firstname, lastname, email, role, password } = req.body;
    const user = await User.create({
      firstname,
      lastname,
      role,
      email,
      password,
    });
    const enUser = await encodePassword(user.password, user._id);
    await res
      .status(utill.status.created)
      .send({ user: enUser, toastMsg: "user created successfully." });
    logger.info({
      url: req.url,
      body: enUser,
      statuscode: utill.status.created,
      method: req.method,
      ip: req.ip,
    });
  } catch (error) {
    errorLogger.error({
      url: req.url,
      body: req.body,
      statuscode: utill.status.badRequest,
      method: req.method,
      error: error.errors,
      ip: req.ip,
    });
    console.log(error);
    res.status(utill.status.badRequest).send(error);
  }
};

const getAllUser = async (req, res) => {
  try {
    const users = await User.findAll();
    await res
      .status(utill.status.success)
      .send({ users: users, toastMsg: "users found" });
    logger.info({
      url: req.url,
      statuscode: utill.status.success,
      method: req.method,
      ip: req.ip,
    });
  } catch (error) {
    res.status(utill.status.serverError).send(error);
    errorLogger.error({
      url: req.url,
      statuscode: utill.status.serverError,
      method: req.method,
      error: error,
      ip: req.ip,
    });
    console.log(error);
  }
};

const getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findByPk(id);
    if (!user) {
      errorLogger.error({
        url: req.url,
        method: req.method,
        id: id,
        statuscode: utill.status.notFound,
        error: "user not found",
        ip: req.ip,
      });
      return res.status(utill.status.notFound).send("user not found");
    }
    await res
      .status(utill.status.success)
      .send({ user: user, toastMsg: "user found" });
    logger.info({
      Message: "user found",
      url: req.url,
      method: req.method,
      statuscode: utill.status.success,
      user: user,
      ip: req.ip,
    });
  } catch (error) {
    res.status(utill.status.serverError).send(error);
    console.log(error);
    errorLogger.error({
      url: req.url,
      method: req.method,
      userId: req.params.id,
      statuscode: utill.status.serverError,
      error: error,
      ip: req.ip,
    });
  }
};

const getLoggedInUser = async (req, res) => {
  try {
    const user = req.user;
    await res.status(utill.status.success).send(user);
    logger.info({
      url: req.url,
      statuscode: utill.status.success,
      method: req.method,
      body: user,
      ip: req.ip,
    });
  } catch (error) {
    await res.send(error);
    errorLogger.error({
      url: req.url,
      statuscode: utill.status.serverError,
      method: req.method,
      body: req.body,
      headers: req.headers,
      ip: req.ip,
    });
    console.log(error);
  }
};

const updateUser = async (req, res) => {
  try {
    const _id = req.params.id;
    await User.update(req.body, { where: { _id: _id } });
    const user = await User.findByPk(_id);
    if (!user) {
      errorLogger.error({
        url: req.url,
        method: req.method,
        body: req.body,
        statuscode: utill.status.notFound,
        ip: req.ip,
      });
      res.status(utill.status.notFound).send("user not found");
    }
    res
      .status(utill.status.success)
      .send({ user: user, toastMsg: "user updated!" });
    logger.info({
      url: req.url,
      method: req.method,
      user: user,
      statuscode: utill.status.success,
      ip: req.ip,
    });
  } catch (error) {
    res.send(error);
    console.log(error);
    errorLogger.error({
      url: req.url,
      method: req.method,
      statuscode: utill.status.serverError,
      body: req.body,
      ip: req.ip,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const _id = req.params.id;
    const user = await User.findByPk(_id);
    if (!user) {
      errorLogger.error({
        url: req.url,
        method: req.method,
        body: req.body,
        statuscode: utill.status.notFound,
        ip: req.ip,
      });
      res.status(utill.status.notFound).send("user not found");
    }
    await User.destroy({ where: { _id: _id } });
    res.status(utill.status.success).send({ toastMsg: "user deleted" });
    logger.info({
      url: req.url,
      method: req.method,
      id: _id,
      statuscode: utill.status.success,
      user: user,
      ip: req.ip,
    });
  } catch (error) {
    res.status(utill.status.serverError).send(error);
    console.log(error);
    errorLogger.error({
      url: req.url,
      method: req.method,
      id: req.params.id,
      statuscode: utill.status.serverError,
      error: error,
      ip: req.ip,
    });
  }
};

const loginUser = async (req, res) => {
  try {
    let user = await findByCredentials(req.body.email, req.body.password);
    if (!user) {
      res.status(400).send({ toastMsg: "Details are not correct.!" });
    } else {
      //user = await getAuthToken(user._id);
      res.status(200).send({
        toastMsg: "Login Successfully.!!",
        data: user,
      });
    }
  } catch (error) {
    res.status(404).send({ toastMsg: "Details are not correct.!" });
    console.log(error);
  }
};

const logoutUser = async (req, res) => {
  try {
    let user = await findByCredentials(req.body.email, req.body.password);
    // await User.update({ token: "" }, { where: { _id: user._id } });
    user = await User.findByPk(user._id);
    res.send(user);
  } catch (error) {
    res.send(error);
    console.log(error);
  }
};

module.exports = {
  createUser,
  getAllUser,
  getUserById,
  getLoggedInUser,
  updateUser,
  deleteUser,
  loginUser,
  logoutUser,
};
