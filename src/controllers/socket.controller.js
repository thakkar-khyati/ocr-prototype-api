const axios = require("axios");

const Process = require("../models/process.model");
const utill = require("../utill");

const getPaymentDetail = async (req, res) => {
  try {
    const user_id = req.params.id;
    const process = await Process.create({ user_id: user_id });
    const reponse = await javaApiCall(process.process_id)
    res.send(reponse)
  } catch (error) {
    console.log(error);
    res.status(utill.status.serverError).send(error);
  }
};

const javaApiCall = async (id) => {
  return new Promise((resolve, reject) => {
    axios
      .get("http://localhost:4000/payment/"+id)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

module.exports = { javaApiCall, getPaymentDetail };
