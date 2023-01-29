const  validarCampos           = require('../middlewares/validadorCampos')
const  validarJWT              = require('../middlewares/validarJWT')
const  validarCargaArchivos    = require('../middlewares/validarCargaArchivo')
const  validarPaginacion       = require('../middlewares/validarPaginacion')  
const  genderCheck             = require('../middlewares/genderCheck')  
const validarRol = require('../middlewares/validarRol')

module.exports = {
    ...validarCampos,
    ...validarJWT,
    ...validarCargaArchivos,
    ...validarPaginacion,
    ...genderCheck,
    ...validarRol,
}