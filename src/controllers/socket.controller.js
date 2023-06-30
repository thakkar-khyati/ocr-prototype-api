const axios = require("axios");


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

module.exports = { javaApiCall };
