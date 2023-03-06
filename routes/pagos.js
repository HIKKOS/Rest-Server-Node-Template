const { Router } = require('express')
const { check } = require('express-validator')

const { validarCampos } = require('../middlewares/validadorCampos')
const { validarJWT } = require('../middlewares/validarJWT')
const { getPagos, postPagos, getPagosById } = require('../controllers/pagos')
const { verifyUserRole,verifyAdminRole } = require('../middlewares/verifyRole')
const { ExisteTutor, ExisteServicio, ExisteAlumno } = require('../helpers/DataBaseValidator')

const router = Router()
router.get('/',[
    validarJWT,  
    verifyUserRole,
    validarCampos
], getPagosById)
router.get('/web/:TutorId',[
    validarJWT,    
    verifyAdminRole,
    check('TutorId').custom( ExisteTutor ),
    validarCampos
], getPagos)

router.post('/',[
    validarJWT,  
    check('TutorId').custom(ExisteTutor),  
    check('ServicioId').custom(ExisteServicio),  
    check('AlumnoId').custom( ExisteAlumno ),  
    check('Facturar','se requiere este campo').isBoolean(),  
    validarCampos
], postPagos)
module.exports = router