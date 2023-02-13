const { Router } = require('express')
const { check } = require('express-validator')

const { validarCampos } = require('../middlewares/validadorCampos')
const { validarJWT } = require('../middlewares/validarJWT')
const { getPagos, postPagos } = require('../controllers/pagos')

const router = Router()

router.get('/',[
    validarJWT,    
    validarCampos
], getPagos)
router.post('/',[
    validarJWT,    
    validarCampos
], postPagos)
module.exports = router