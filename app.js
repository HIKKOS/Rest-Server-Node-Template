require('dotenv').config()
const Server = require('./models/server')
const server = new Server()
const bc = require('bcryptjs')
const salt = bc.genSaltSync()
const pass = bc.hashSync('12345678',salt)
console.log(pass);

server.listen()

