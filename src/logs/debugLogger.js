const winston = require("winston");
const { ElasticsearchTransport } = require("winston-elasticsearch");

const esTransport = new ElasticsearchTransport({
  level: "debug",
  indexPrefix: "ocrlogs",
  clientOpts: { node: "http://localhost:9200" },
});

const debugLogger = new winston.createLogger({
  level: "debug",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
    winston.format.prettyPrint()
  ),
  transports:[new winston.transports.Console(), esTransport]
});

module.exports = debugLogger