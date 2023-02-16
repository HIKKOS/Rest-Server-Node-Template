const { PrismaClient } = require("@prisma/client")
const { request, response } = require("express")
const jwt = require('jsonwebtoken')
const prisma = new PrismaClient()
const verifyAdminRole = async (req = request, res = response, next) => {
    const token = req.header('x-token')
    const { Id } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    const admin = await prisma.administrador.findUnique( {where: {Id}})
    if( !admin ){
        return res.status(401).json({msg:'no tienes permisos'})
    } 
    next()
}
const verifyUserRole = async (req = request, res = response, next) => {
    const token = req.header('x-token')
    const { Id } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
    const admin = await prisma.administrador.findUnique( {where: {Id}})
    if( !tutor ){
        return res.status(401).json({msg:'no tienes permisos'})
    } 
    next()
}
module.exports = {
    verifyAdminRole,
    verifyUserRole,
}