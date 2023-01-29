const { response, request } = require('express')
const bcryptjs = require('bcryptjs')

const jwt = require('jsonwebtoken')
const validarJWT = async (req = request, res = response, next ) => {
    const token = req.header('x-token')
    if( !token ){
        return res.status(401).json({
            msg: 'no hay token en la peticion'
        })
    }
    try {        
        const { Id, rol } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)           
        req.auth = {Id,rol}
        next()
    } catch (error) {
        if(error === jwt.TokenExpiredError){
            return res.status(401).json({
                msg:'expiro el JWT'
            })
        }
        if(error === jwt.JsonWebTokenError){
            console.log(error)
        }
        res.status(401).json({
            msg: 'token no valido'
        })
    }
} 

module.exports = {
    validarJWT,
}