const { PrismaClient } = require("@prisma/client")
const { request, response } = require("express")
const bcryptjs = require('bcryptjs')
const prisma = new PrismaClient()
const verifyAdminRole = (req = request, res = response, next) => {
    if( !req.auth ) {
        return res.status(400).json({
            msg:'se quiere verificar el rol sin validar token'
        })
    }
    const {rol} = req.auth
    if( !bcryptjs.compareSync('Administrador',rol) ){
        return res.status(401).json({
            msg: "no perimitido"
        })
    }
    next()
}
const verifyUserRole = (req = request, res = response, next) => {
    if( !req.auth ) {
        return res.status(400).json({
            msg:'se quiere verificar el rol sin validar token'
        })
    }
    const {rol} = req.auth
    if( !bcryptjs.compareSync('Tutor',rol) ){
        return res.status(401).json({
            msg: "no permitido"
        })
    }
    next()
}
const hasRole = ( ...roles ) =>{
    return (req, res, next) => {
        if( !req.userAuth ) {
            return res.status(500).json({
                msg:'se quiere verificar el rol sin validar token'
            })
        }
        if( !roles.includes( req.userAuth.role ) ){
            return res.status(500).json({
                msg: `tienes el rol: ${req.userAuth.role} se requiere uno de estos roles para este servicio: ${roles}`
            })
        }
        next()
    }
}

module.exports = {
    verifyAdminRole,
    verifyUserRole,
    hasRole,

}