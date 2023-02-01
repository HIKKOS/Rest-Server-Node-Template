const bcryptjs = require('bcryptjs')
const encriptarCampo = ( dato = '' ) =>{
    if(!isNaN(dato)){
        dato = dato.toString()
    }
    const salt = bcryptjs.genSaltSync()
    const campo = bcryptjs.hashSync(dato,salt)
    return campo
}
module.exports = encriptarCampo