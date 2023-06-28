const express = require("express")
const paymentRouter = express.Router()

const { getPaymentDetail} = require("../controllers/socket.controller")

paymentRouter.get('/:id',getPaymentDetail)

module.exports = paymentRouter