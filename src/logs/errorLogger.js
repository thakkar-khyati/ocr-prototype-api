const winston = require('winston')
const {ElasticsearchTransport} = require('winston-elasticsearch')

const esTransport = new ElasticsearchTransport({
    level:'error',
    indexPrefix:'ocr-logs',
    clientOpts:{node:'http://localhost:9200'}
})

const errorLogger = new winston.createLogger({
    level:'error',
    format:winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        winston.format.prettyPrint()
    ),
    transports:[
        new winston.transports.Console(),
        esTransport
    ]
})

module.exports = errorLogger