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

const redisClient = redis.createClient({
  legacyMode: true,
  socket: {
    host: "localhost",
    port: 6379,
  },
});
const DEFAULT_EXPIRATION = 3600;
redisClient.on("connect", () => {
  console.log("Connected to Redis12345");
});

redisClient
  .connect()
  .then(() => {
    console.log("Connected to Redis");
  })
  .catch((err) => {
    console.log(err.message);
  });

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
    res
      .status(utill.status.created)
      .send({ user: enUser, toastMsg: "user created successfully." });
    const users = await User.findAll();
    redisClient.setEx("ocr_users", DEFAULT_EXPIRATION, JSON.stringify(users));
    redisClient.setEx(
      `ocr_users?id=${_id}`,
      DEFAULT_EXPIRATION,
      JSON.stringify(user)
    );
    logger.info({
      url: req.url,
      user: enUser,
      statuscode: utill.status.created,
      method: req.method,
      ip: req.ip,
      additional_info:"user created and added to cache memory"
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
  redisClient.get("ocr_users", async (error, ocr_users) => {
    if (error) {
      console.log(error);
    }
    if (ocr_users != null) {
      console.log("Cache hit");
      logger.info({
        url: req.url,
        statuscode: utill.status.success,
        method: req.method,
        ip: req.ip,
        additional_info: "redis cache was there for users and is used",
      });
      return res.json(JSON.parse(ocr_users));
    } else {
      console.log("cache miss");
      try {
        const users = await User.findAll();
        await res
          .status(utill.status.success)
          .send({ users: users, toastMsg: "users found" });
        redisClient.setEx(
          "ocr_users",
          DEFAULT_EXPIRATION,
          JSON.stringify(users)
        );
        logger.info({
          url: req.url,
          statuscode: utill.status.success,
          method: req.method,
          ip: req.ip,
          additional_info: "redis cache was not there but is now created",
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
    }
  });
};

const getUserById = async (req, res) => {
  const id = req.params.id;
  redisClient.get(`ocr_users?id=${id}`, async (error, user) => {
    if (error) {
      console.log(error);
    }
    if (user != null) {
      console.log("cache hit");
      logger.info({
        url: req.url,
        statuscode: utill.status.success,
        method: req.method,
        ip: req.ip,
        additional_info: "redis cache was there for users and is used",
        user: user,
      });
      return res.send(JSON.parse(user));
    } else {
      try {
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
          additional_info: "redis cache was not there but is now created",
        });
        redisClient.setEx(
          `ocr_users?id=${id}`,
          DEFAULT_EXPIRATION,
          JSON.stringify(user)
        );
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
    }
  });
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
    const users = await User.findAll();
    redisClient.setEx("ocr_users", DEFAULT_EXPIRATION, JSON.stringify(users));
    redisClient.get(`ocr_users?id=${_id}`, (error, ocr_user) => {
      if (error) {
        console.log(error);
      }
      if (ocr_user != null) {
        redisClient.setEx(
          `ocr_users?id=${_id}`,
          DEFAULT_EXPIRATION,
          JSON.stringify(user)
        );
        logger.info({
          url: req.url,
          method: req.method,
          user: user,
          statuscode: utill.status.success,
          ip: req.ip,
          message: "Redis cache memory updated.",
        });
      } else {
        redisClient.setEx(
          `ocr_users?id=${_id}`,
          DEFAULT_EXPIRATION,
          JSON.stringify(user)
        );
        logger.info({
          url: req.url,
          method: req.method,
          user: user,
          statuscode: utill.status.success,
          ip: req.ip,
          message: "Redis cache memory created for the updated user",
        });
      }
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
    const users = await User.findAll();
    redisClient.setEx("ocr_users", DEFAULT_EXPIRATION, JSON.stringify(users));
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
