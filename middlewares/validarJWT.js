const { PrismaClient } = require('@prisma/client')
const { response, request } = require('express')
const jwt = require('jsonwebtoken')

const prisma = new PrismaClient()
const validarJWT = async (req = request, res = response, next ) => {
    const token = req.header('x-token')
    if( !token ){
        return res.status(401).json({
            msg: 'no hay token en la peticion'
        })
    }
    try {
        const { Id } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)
        req.id = Id
        const userAuth = await prisma.administrador.findUnique( { where: { Id } } ) 
        req.userAuth = userAuth
        next()
    } catch (error) {
        if(jwt.TokenExpiredError){
            return res.status(400).json({
                msg:'expiro el JWT'
            })
        }
        console.log(error)
        res.status(401).json({
            msg: 'token no valido'
        })
    }
} 

module.exports = {
    validarJWT,
}