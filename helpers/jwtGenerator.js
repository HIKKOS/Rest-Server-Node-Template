
const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const generarJWT = (Id = '', rol = '') => {
    const salt= bcryptjs.genSaltSync()    
    return new Promise( (resolve, reject) => {        
        rol = bcryptjs.hashSync(rol, salt)
        const payload = { Id, rol }
        jwt.sign( payload, process.env.SECRETORPRIVATEKEY, {
            expiresIn: '4h'
        },(err, token) => {
            if(err){
                reject('no se genero el JWT')
            } else {
                resolve(token)
            }
            
        }) 
    })
}
module.exports = {
    generarJWT,
}