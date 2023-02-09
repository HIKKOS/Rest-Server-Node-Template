const  validarCampos           = require('../middlewares/validadorCampos')
const  validaRoles             = require('../middlewares/roleCheck')
const  validarJWT              = require('../middlewares/validarJWT')
const  validarCargaArchivos    = require('../middlewares/validarCargaArchivo')
const  validarPaginacion       = require('../middlewares/validarPaginacion')  
const  genderCheck             = require('../middlewares/genderCheck')  

module.exports = {
    ...validarCampos,
    ...validarJWT,
    ...validaRoles,
    ...validarCargaArchivos,
    ...validarPaginacion,
    ...genderCheck,
}