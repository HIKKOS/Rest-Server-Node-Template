const jwt = require('jsonwebtoken')
const generarJWT = (uid = '') => {
    return new Promise( (resolve, reject) => {
        const payload = { uid }
        jwt.sign( payload, process.env.SECRETORPRIVATEKEY ?? "qwq", {
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