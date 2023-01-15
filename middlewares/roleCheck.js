const { request, response } = require("express")

const verifyAdminRole = (req = request, res = response, next) => {
    if( !req.userAuth ) {
        return res.status(500).json({
            msg:'se quiere verificar el rol sin validar token'
        })
    }
    const {role, name} = req.userAuth
    if( role !== 'ADMIN_ROLE' )
    return res.status(401).json({
        msg: `${name} no es administrador - no perimitido`
    })
      
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
    hasRole

}