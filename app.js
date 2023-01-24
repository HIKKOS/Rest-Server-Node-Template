require('dotenv').config()
const { PrismaClient, Prisma } = require('@prisma/client')
const Server = require('./models/server')

const server = new Server()
server.listen()

