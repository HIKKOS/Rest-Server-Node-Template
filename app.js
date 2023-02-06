require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const Server = require('./models/server')
const prisma = new PrismaClient	()
const server = new Server()

server.listen()

