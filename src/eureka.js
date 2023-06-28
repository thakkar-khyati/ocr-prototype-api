const Eureka = require("eureka-js-client").Eureka;
const dotenv = require("dotenv");

dotenv.config();

const client1 = new Eureka({
  // application instance information
  instance: {
    app: "khyati-ocr",
    hostName: "localhost",
    ipAddr: "192.168.2.30",
    port: {
      $: process.env.PORT1 && process.env.PORT2 && process.env.PORT3 && process.env.PORT4,
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


module.exports = { client1, };
