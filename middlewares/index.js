const  validarCampos           = require('../middlewares/validadorCampos')
const  validaRoles             = require('../middlewares/roleCheck')
const  validarJWT              = require('../middlewares/validarJWT')
const  validarCargaArchivos    = require('../middlewares/validarCargaArchivo')

module.exports = {
    ...validarCampos,
    ...validarJWT,
    ...validaRoles,
    ...validarCargaArchivos,
}