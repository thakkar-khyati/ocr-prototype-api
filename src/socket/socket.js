const express = require("express")
const http = require("http")
const socketio = require("socket.io")


const app = express()
const server = http.createServer(app)
const io = socketio(server)
const port = process.env.SOCKET_PORT || 4001

server.listen(port,()=>{
    console.log("socket running on ",port)
})