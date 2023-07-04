const jwt = require("jsonwebtoken");
const axios = require("axios");
const fs = require("fs");

const { User } = require("../models/users.model");
const Roles = require("../models/roles.model");

const logger = require("../logs/infoLogger");
const errorLogger = require("../logs/errorLogger");
const debugLogger = require("../logs/debugLogger");

const utill = require("../utill");

const createUser = async (req, res) => {
  try {
    let {
      first_name,
      last_name,
      email,
      role,
      password,
      organization_name,
      phone_no,
      country,
    } = req.body;
    debugLogger.debug({
      url: req.url,
      method: req.method,
      ip: req.ip,
      req_body: {
        first_name,
        last_name,
        email,
        role,
        organization_name,
        phone_no,
        country,
      },
      additional_info: "req body has been retrived.",
    });
    if (role === undefined) {
      role = "ROLE_USER";
    }
    const UserRole = await Roles.findOne({ where: { role: role } });
    const user = await User.create({
      first_name,
      last_name,
      email,
      role_id: UserRole._id,
      password,
      organization_name,
      phone_no,
      country,
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
      body: req.body,
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
    errorLogger.error({
      url: req.url,
      method: req.method,
      ip: req.ip,
      statuscode: utill.status.serverError,
      error: error,
    });
    console.log(error);
    res.status(utill.status.serverError).send(error);
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
        id: id,
        body: req.body,
        additional_info: "user not found!",
      });
      return res
        .status(utill.status.notFound)
        .send({ toastMsg: "user not found!" });
    }
    await User.update(req.body, { where: { _id: id } });
    user = await User.findByPk(id);
    debugLogger.debug({
      url: req.url,
      method: req.method,
      ip: req.ip,
      user: user,
      additional_info: "user found and updated!",
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
      statuscode: utill.status.success,
      user: user,
      additional_info: "updated user sent as response.",
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

const updateAvatar = async (req, res) => {
  try {
    const id = req.params.id;
    debugLogger.debug({
      url: req.url,
      method: req.method,
      ip: req.ip,
      statuscode: utill.status.success,
      id: id,
      additional_info: "id retrived from the params.",
    });
    const user = await User.findOne({ where: { _id: id } });
    debugLogger.debug({
      url: req.url,
      method: req.method,
      ip: req.ip,
      statuscode: utill.status.success,
      user: user,
      additional_info: "user retrived from id given in the params.",
    });
    if (!user) {
      debugLogger.debug({
        url: req.url,
        method: req.method,
        ip: req.ip,
        statuscode: utill.status.notFound,
        id: id,
        body: req.body,
        additional_info: "user not found!",
      });
      return res
        .status(utill.status.notFound)
        .send({ toastMsg: "user not found!" });
    }
    if (user.avatar !== null) {
      const filename = user.avatar.replace(process.env.IMG_URL, "");
      const directoryPath = process.env.IMG_PATH;
      const path = directoryPath + filename;
      fs.unlink(path, (error) => {
        console.log(error);
      });
      debugLogger.debug({
        url:req.url,
        method:req.method,
        ip:req.ip,
        statuscode:utill.status.success,
        user:user,
        additional_info:"avatar for user is deleted from the images folder."
      })
    }
    const avatar = process.env.IMG_URL + req.file.filename;
    const updatedUser = await User.update({ avatar }, { where: { _id: id } });
    debugLogger.debug({
      url: req.url,
      method: req.method,
      ip: req.ip,
      statuscode: utill.status.success,
      user: updateUser,
      additional_info: "updated user with updated avatar path sent as response.",
    });
    res.status(utill.status.success).send(updatedUser);
    logger.info({
      url: req.url,
      method: req.method,
      ip: req.ip,
      statuscode: utill.status.success,
      user: updateUser,
      additional_info: "updated user sent as response.",
    });
    debugLogger.debug({
      url: req.url,
      method: req.method,
      ip: req.ip,
      statuscode: utill.status.success,
      user: updateUser,
      additional_info: "updated user sent as response.",
    });
  } catch (error) {
    console.log(error);
    res.send(error);
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
        id: id,
        additional_info: "user not found!",
      });
      return res
        .status(utill.status.notFound)
        .send({ toastMsg: "user not found!" });
    }
    await User.destroy({ where: { _id: id } });
    debugLogger.debug({
      url: req.url,
      method: req.method,
      ip: req.ip,
      statuscode: utill.status.success,
      user: user,
      additional_info: "user deleted.",
    });
    const filename = user.avatar.replace(process.env.IMG_URL, "");
    const directoryPath = process.env.IMG_PATH;
    const path = directoryPath + filename;
    fs.unlink(path, (error) => {
      console.log(error);
    });
    res.status(utill.status.success).send({ toastMsg: "user deleted." });
    logger.info({
      url: req.url,
      method: req.method,
      ip: req.ip,
      statuscode: utill.status.success,
      id: id,
      user: user,
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

const forgetPassword = async (req, res) => {
  try {
    const user = await User.findOne({ where: { email: req.body.email } });

    if (!user) {
      debugLogger.debug({
        url: req.url,
        method: req.method,
        ip: req.ip,
        statuscode: utill.status.notFound,
        email: req.body.email,
        additional_info: "user not found!",
      });
      return res
        .status(utill.status.notFound)
        .send({ toastMsg: "user not found!" });
    }
    debugLogger.debug({
      url: req.url,
      method: req.method,
      ip: req.ip,
      user: user,
      additional_info: "user found!",
    });
    const JWT_SECRET = process.env.JWT_SECRET_FORGET_PASSWORD;
    const secret = JWT_SECRET + user.password;

    const payload = {
      email: user.email,
      id: user._id,
    };

    const token = jwt.sign(payload, secret, { expiresIn: "10m" });

    const link = `http://localhost:3001/users/reset-password/${user._id}/${token}`;

    debugLogger.debug({
      url: req.url,
      method: req.method,
      ip: req.ip,
      user: user,
      link: link,
      additional_info: "link for reset password created.",
    });

    const data = {
      email: user.email,
      name: `${user.first_name} ${user.last_name}`,
      link: link,
    };

    await axios
      .post("http://192.168.2.41:8000/resetpassword", data)
      .then((result) => {
        res
          .status(utill.status.success)
          .send({ toastMsg: "reset password link send in an email." });
        debugLogger.debug({
          url: req.url,
          method: req.method,
          ip: req.ip,
          user: user,
          link: link,
          additional_info: "link for reset password sent as an email.",
        });
      })
      .catch((error) => {
        res.status(utill.status.badRequest).send(error);
        errorLogger.error({
          url: req.url,
          method: req.method,
          ip: req.ip,
          statuscode: utill.status.badRequest,
          email: req.body.email,
          error: error,
        });
      });
  } catch (error) {
    console.log(error);
    res.status(utill.status.serverError).send(error);
    errorLogger.error({
      url: req.url,
      method: req.method,
      ip: req.ip,
      statuscode: utill.status.serverError,
      email: req.body.email,
      error: error,
    });
  }
};

const userForResetPassword = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      debugLogger.debug({
        url: req.url,
        method: req.method,
        ip: req.ip,
        statuscode: utill.status.notFound,
        email: req.body.email,
        additional_info: "user not found!",
      });
      return res
        .status(utill.status.notFound)
        .send({ toastMsg: "user not found!" });
    }

    const JWT_SECRET = process.env.JWT_SECRET_FORGET_PASSWORD;
    const secret = JWT_SECRET + user.password;

    if (isTokenExpired(req.params.token, secret) === true) {
      debugLogger.debug({
        url: req.url,
        method: req.method,
        ip: req.ip,
        statuscode: utill.status.pageExpired,
        additional_info: "token expired",
      });
      return res
        .status(utill.status.pageExpired)
        .send({ toastMsg: "token expired" });
    }
    const payload = jwt.verify(req.params.token, secret);

    debugLogger.debug({
      url: req.url,
      method: req.method,
      ip: req.ip,
      statuscode: utill.status.success,
      payload: payload,
      additional_info: "token is verified and sent as a response.",
    });

    res.send(payload);
  } catch (error) {
    console.log(error);
    res.status(utill.status.serverError).send(error);
    errorLogger.error({
      url: req.url,
      method: req.method,
      ip: req.ip,
      statuscode: utill.status.serverError,
      email: req.body.email,
      error: error,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    let user = await User.findByPk(req.params.id);
    if (!user) {
      debugLogger.debug({
        url: req.url,
        method: req.method,
        ip: req.ip,
        statuscode: utill.status.notFound,
        email: req.body.email,
        additional_info: "user not found!",
      });
      return res
        .status(utill.status.notFound)
        .send({ toastMsg: "user not found!" });
    }
    user.password = req.body.password;
    await user.save();
    debugLogger.debug({
      url: req.url,
      method: req.method,
      ip: req.ip,
      statuscode: utill.status.success,
      user: user,
      additional_info: "reset password successfull.",
    });
    res
      .status(utill.status.success)
      .send({ user: user, toastMsg: "reset password successfull." });
    logger.info({
      url: req.url,
      method: req.method,
      ip: req.ip,
      statuscode: utill.status.success,
      user: user,
      additional_info: "reset password successfull and user sent as reponse.",
    });
  } catch (error) {
    console.log(error);
    res.status(utill.status.serverError).send(error);
    errorLogger.error({
      url: req.url,
      method: req.method,
      ip: req.ip,
      statuscode: utill.status.serverError,
      email: req.body.email,
      error: error,
    });
  }
};

const isTokenExpired = (token, secret) => {
  try {
    const payload = jwt.verify(token, secret);
    const expirationTime = payload.exp;
    const currentTime = Math.floor(Date.now() / 1000);
    return expirationTime < currentTime;
  } catch (error) {
    return true;
  }
};

module.exports = {
  createUser,
  getAllUser,
  getUserById,
  updateUser,
  updateAvatar,
  deleteUser,
  forgetPassword,
  userForResetPassword,
  resetPassword,
};
