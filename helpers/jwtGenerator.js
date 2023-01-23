const jwt = require('jsonwebtoken')
const generarJWT = (Id = '') => {
    return new Promise( (resolve, reject) => {
        const payload = { Id }
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