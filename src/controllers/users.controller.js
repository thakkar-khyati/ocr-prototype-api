const { User } = require("../models/users.model");

const logger = require("../logs/infoLogger");
const errorLogger = require("../logs/errorLogger");
const debugLogger = require("../logs/debugLogger");

const utill = require("../utill");

const createUser = async (req, res) => {
  try {
    const { firstname, lastname, email, role, password } = req.body;
    debugLogger.debug({
      url: req.url,
      method: req.method,
      ip: req.ip,
      req_body: { firstname, lastname, email, role },
      additional_info: "req body has been retrived.",
    });
    const user = await User.create({
      firstname,
      lastname,
      role,
      email,
      password,
    });
    debugLogger.debug({
      url: req.url,
      method: req.method,
      ip: req.ip,
      req_body: user,
      additional_info: "user created",
    });
    res
    .status(utill.status.created)
    .send({ user: user, toastMsg: "user created successfully." });
    logger.info({
      url: req.url,
      method: req.method,
      ip: req.ip,
      statuscode: utill.status.created,
      user: user,
      additional_info: "user created successfully.",
    });
    debugLogger.debug({
      url: req.url,
      method: req.method,
      ip: req.ip,
      statuscode: utill.status.success,
      user: user,
      additional_info: "User created successfully and send as repsponse.",
    });
  } catch (error) {
    errorLogger.error({
      url: req.url,
      method: req.method,
      ip: req.ip,
      statuscode: utill.status.badRequest,
      body: { firstname, lastname, email, role },
      error: error.errors,
    });
    console.log(error);
    res.status(utill.status.badRequest).send(error);
  }
};

const getAllUser = async (req, res) => {
  try {
    const users = await User.findAll();
    if (users.length === 0) {
      res.send({ toastMsg: "no users found!" });
      debugLogger.debug({
        url: req.url,
        method: req.methods,
        ip: req.ip,
        additional_info: "There are no users in the database!",
      });
    } else {
      debugLogger.debug({
        url: req.url,
        method: req.method,
        ip: req.ip,
        statuscode: utill.status.success,
        additional_info: "users retrived from database.",
      });
      await res
        .status(utill.status.success)
        .send({ users: users, toastMsg: "users found." });
      debugLogger.debug({
        url: req.url,
        method: req.method,
        ip: req.ip,
        statuscode: utill.status.success,
        additional_info: "users sent to api gateway as response",
      });
      logger.info({
        url: req.url,
        method: req.method,
        ip: req.ip,
        statuscode: utill.status.success,
        additional_info: "users sent as reponse.",
      });
    }
  } catch (error) {
    res.status(utill.status.serverError).send(error);
    errorLogger.error({
      url: req.url,
      method: req.method,
      ip: req.ip,
      statuscode: utill.status.serverError,
      error: error,
    });
    console.log(error);
  }
};

const getUserById = async (req, res) => {
  try {
    const id = req.params.id;
    debugLogger.debug({
      url: req.url,
      methods: req.method,
      ip: req.ip,
      id: id,
      additional_info: "id of the user retracted from request.",
    });
    const user = await User.findByPk(id);
    if (!user) {
      debugLogger.debug({
        url: req.url,
        method: req.method,
        ip: req.ip,
        statuscode: utill.status.notFound,
        id: id,
        additional_info: "user not found!",
      });
      return res
        .status(utill.status.notFound)
        .send({ toastMsg: "user not found!" });
    }
    await res
      .status(utill.status.success)
      .send({ user: user, toastMsg: "user found." });
    debugLogger.debug({
      url: req.url,
      method: req.method,
      ip: req.ip,
      user: user,
      additional_info: "user found and sent as response.",
    });
    logger.info({
      url: req.url,
      method: req.method,
      ip: req.ip,
      statuscode: utill.status.success,
      user: user,
      Message: "user found",
    });
  } catch (error) {
    res.status(utill.status.serverError).send(error);
    console.log(error);
    errorLogger.error({
      url: req.url,
      method: req.method,
      ip: req.ip,
      statuscode: utill.status.serverError,
      userId: req.params.id,
      error: error,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    debugLogger.debug({
      url: req.url,
      methods: req.method,
      ip: req.ip,
      id: id,
      additional_info: "id of user is retracted from request to be updated.",
    });
    let user = await User.findByPk(id);
    if (!user) {
      debugLogger.debug({
        url: req.url,
        method: req.method,
        ip: req.ip,
        statuscode: utill.status.notFound,
        id:id,
        body: req.body,
        additional_info: "user not found!",
      });
      return res.status(utill.status.notFound).send({ toastMsg: "user not found!" });
    }
    await User.update(req.body, { where: { _id: id } });
    user = await User.findByPk(id);
    debugLogger.debug({
      url: req.url,
      method: req.method,
      ip: req.ip,
      user: user,
      additional_info:"user found and updated!"
    });
    res
      .status(utill.status.success)
      .send({ user: user, toastMsg: "user updated!" });
    logger.info({
      url: req.url,
      method: req.method,
      ip: req.ip,
      statuscode: utill.status.success,
      user: user,
    });
    debugLogger.debug({
      url: req.url,
      method: req.method,
      ip: req.ip,
      statuscode:utill.status.success,
      user: user,
      additional_info:"updated user sent as response."
    });
  } catch (error) {
    res.send(error);
    console.log(error);
    errorLogger.error({
      url: req.url,
      method: req.method,
      ip: req.ip,
      statuscode: utill.status.serverError,
      body: req.body,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    debugLogger.debug({
      url: req.url,
      methods: req.method,
      ip: req.ip,
      id: id,
      additional_info: "id of user is retracted from request to be updated.",
    });
    const user = await User.findByPk(id);
    if (!user) {
      debugLogger.debug({
        url: req.url,
        method: req.method,
        ip: req.ip,
        statuscode: utill.status.notFound,
        id:id,
        additional_info:"user not found!"
      });
      return res.status(utill.status.notFound).send({toastMsg:"user not found!"});
    }
    await User.destroy({ where: { _id: id } });
    debugLogger.debug({
      url:req.url,
      method:req.method,
      ip:req.ip,
      statuscode:utill.status.success,
      user:user,
      additional_info:"user deleted."
    })
    res.status(utill.status.success).send({ toastMsg: "user deleted." });
    logger.info({
      url: req.url,
      method: req.method,
      ip: req.ip,
      statuscode: utill.status.success,
      id: id,
      user: user
    });
  } catch (error) {
    res.status(utill.status.serverError).send(error);
    console.log(error);
    errorLogger.error({
      url: req.url,
      method: req.method,
      ip: req.ip,
      statuscode: utill.status.serverError,
      id: req.params.id,
      error: error,
    });
  }
};

module.exports = {
  createUser,
  getAllUser,
  getUserById,
  updateUser,
  deleteUser,
};
