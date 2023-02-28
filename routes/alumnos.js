const { Router } = require('express')
const { check } = require('express-validator')

const { 
    alumnosGet,
    alumnosPost,
    alumnosPut, 
    alumnosDelete,
    getServiciosDelAlumno,
} = require('../controllers/alumnos')
const { verificarJWT } = require('../controllers/auth')
const { validarPaginacion, validarCampos,genderCheck, validarJWT } = require('../middlewares')
const { gradeCheck } = require('../middlewares/gradeCheck')
const { verifyUserRole } = require('../middlewares/verifyRole')

const router = Router()

router.get('/',[
    validarJWT,
    validarPaginacion, 
    validarCampos
], alumnosGet )
router.get('/servicios/:IdAlumno',[
    validarJWT,
    verifyUserRole,
    check('IdAlumno','es obligatorio').notEmpty(),
    validarCampos
], getServiciosDelAlumno )

router.put('/:Id',[
    validarJWT,
    check('Id','ser requiere este campo').notEmpty(),
    check('Nombres','no se recibieron datos').not().isEmpty(),
    check('ApellidoMaterno','no se recibieron datos').not().isEmpty(),
    check('ApellidoPaterno','no se recibieron datos').not().isEmpty(),
    check('Grupo','no se recibieron datos').not().isEmpty(),
    check('Genero').isBoolean(),
    check('Grado','debe ser numerico').isNumeric(),
    validarCampos
], alumnosPut )
router.post('/',[
    validarJWT,
    check('Nombres','no se recibieron datos').not().isEmpty(),
    check('ApellidoMaterno','no se recibieron datos').not().isEmpty(),
    check('ApellidoPaterno','no se recibieron datos').not().isEmpty(),
    check('Grupo','no se recibieron datos').not().isEmpty(),
    check('Genero').isBoolean(),
    check('Grado','debe ser numerico').isNumeric(),
    check('Grado').custom(gradeCheck),
    validarCampos
], alumnosPost )
router.delete('/:Id',[
    validarJWT,
    check('Id','Debe ser numerico').isNumeric()
],alumnosDelete)
module.exports = router
    