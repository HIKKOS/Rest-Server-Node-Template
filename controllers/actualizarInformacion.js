const { response, request } = require('express')

const bcryptjs = require('bcryptjs')
const  { PrismaClient } = require ("@prisma/client");
const prisma = new PrismaClient()
const actualizarDatos= async (req = request, res = response) =>{
    const { Id } = req.auth 
    const data = req.body
    if(data.Telefono){
        data.Telefono = data.Telefono.toString()
    }
    await prisma.tutor.update({
        where: {
            Id:Number(Id)
        },
        data
    }) 
    res.json({
        data
    })
} 

module.exports = {
    actualizarDatos,
}