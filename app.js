require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const Server = require('./models/server')
const prisma = new PrismaClient	()
const server = new Server()
async function u(){
    const servicio = await prisma.servicio.findMany()
    const names = servicio.map(s => {
        return s.Nombre
    })
    console.log(names.includes('Agua'))
    console.log(names);
}
u()
server.listen()

