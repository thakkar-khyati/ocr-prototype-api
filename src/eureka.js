const Eureka = require("eureka-js-client").Eureka;
const dotenv = require('dotenv')

dotenv.config()

const client = new Eureka({
  // application instance information
  instance: {
    app: "khyati-ocr",
    hostName: "localhost",
    ipAddr: "127.0.0.1",
    port: {
      $: process.env.PORT,
      "@enabled": "true",
    },
    vipAddress: "khyati.com",
    dataCenterInfo: {
      "@class": "com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo",
      name: "MyOwn",
    },
  },
  eureka: {
    // eureka server host / port
    host: process.env.EUREKA_HOST,
    port: process.env.EUREKA_PORT,
    servicePath: "/eureka/apps/",
  },
});

module.exports = client;