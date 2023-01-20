const { Router } = require('express')
const { check } = require('express-validator')

const { 
    alumnosGet,
    alumnosPost,
    alumnosPut, 
} = require('../controllers/alumnos')
const { validarPaginacion, validarCampos,genderCheck } = require('../middlewares')

const router = Router()
router.get('/',[
    validarPaginacion, 
    validarCampos
],alumnosGet )
router.put('/:id',[
    check('id', 'el id debe ser numerico').isNumeric(),
    validarCampos
],alumnosPut )
router.post('/',[
    check('Nombres','no se recibieron datos').not().isEmpty(),
    check('ApellidoMaterno','no se recibieron datos').not().isEmpty(),
    check('ApellidoPaterno','no se recibieron datos').not().isEmpty(),
    check('Grupo','no se recibieron datos').not().isEmpty(),
    genderCheck('MASCULINO', 'FEMENINO' ),
    check('Grado','debe ser numerico').isNumeric(),
    check('TutorId','debe ser numerico').isNumeric(),
    validarCampos
],alumnosPost )

module.exports = router
    