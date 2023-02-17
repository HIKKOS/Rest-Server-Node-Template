const { Router } = require('express')
const { check } = require('express-validator')

const { validarCampos } = require('../middlewares/validadorCampos')
const { validarJWT } = require('../middlewares/validarJWT')
const { getPagos, postPagos, getPagosById } = require('../controllers/pagos')

const router = Router()
router.get('/:TutorId',[
    validarJWT,  
    check('TutorId', 'se requiere este campo').notEmpty(),  
    validarCampos
], getPagosById)
router.get('/',[
    validarJWT,    
    validarCampos
], getPagos)

router.post('/',[
    validarJWT,  
    check('TutorId','se requiere este campo').notEmpty(),  
    check('ServicioId','se requiere este campo').notEmpty(),  
    check('AlumnoId','se requiere este campo').notEmpty(),  
    check('Facturar','se requiere este campo').isBoolean(),  
    validarCampos
], postPagos)
module.exports = router