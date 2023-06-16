const axios = require("axios");

const javaApiCall = async () => {
  return new Promise((resolve, reject) => {
    axios
      .get("http://192.168.2.71:9191/customers/stream")
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

module.exports = javaApiCall