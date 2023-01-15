const { response, request } = require('express')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Role = require('../models/role')
const existeRol = require('../helpers/DBvalidators')
const validarJWT = async (req = request, res = response, next ) => {
    const token = req.header('x-token')
    if(!token){
        return res.status(401).json({
            msg: 'no hay token en la peticion'
        })
    }
    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)
        req.uid = uid
        const userAuth = await User.findById(uid)       
        req.userAuth = userAuth
        next()
    } catch (error) {
        console.log(error)
        res.status(401).json({
            msg: 'token no valido'
        })
    }
} 

module.exports = {
    validarJWT,
}