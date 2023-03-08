const jwt = require('jsonwebtoken')
const generarJWT = (Id = '', rol = 'Tutor' ) => {
    return new Promise( (resolve, reject) => {
        const payload = { Id, rol }
        jwt.sign( payload, process.env.SECRETORPRIVATEKEY,(err, token) => {
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