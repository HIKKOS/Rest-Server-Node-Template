const  validarCampos  = require('../middlewares/validadorCampos')
const  validaRoles = require('../middlewares/roleCheck')
const  validarJWT = require('../middlewares/validarJWT')

module.exports = {
    ...validarCampos,
    ...validarJWT,
    ...validaRoles,
}