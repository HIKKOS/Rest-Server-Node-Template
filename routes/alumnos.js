const { Router } = require('express')
const { check } = require('express-validator')

const { 
    alumnosGet,
    alumnosPost,
    alumnosPut, 
    alumnosDelete,
} = require('../controllers/alumnos')
const { validarPaginacion, validarCampos,genderCheck, validarJWT } = require('../middlewares')

const router = Router()
router.get('/',[
    validarJWT,
    validarPaginacion, 
    validarCampos
], alumnosGet )
router.put('/:Id',[
    validarJWT,
    check('Id','Debe ser numerico').isNumeric(),
    check('Nombres','no se recibieron datos').not().isEmpty(),
    check('ApellidoMaterno','no se recibieron datos').not().isEmpty(),
    check('ApellidoPaterno','no se recibieron datos').not().isEmpty(),
    check('Grupo','no se recibieron datos').not().isEmpty(),
    check('Genero').isNumeric().isLength({min:1}),
    check('Grado','debe ser numerico').isNumeric(),
    validarCampos
], alumnosPut )
router.post('/',[
    validarJWT,
    check('Nombres','no se recibieron datos').not().isEmpty(),
    check('ApellidoMaterno','no se recibieron datos').not().isEmpty(),
    check('ApellidoPaterno','no se recibieron datos').not().isEmpty(),
    check('Grupo','no se recibieron datos').not().isEmpty(),
    check('Genero').isNumeric().isLength({min:1}),
    check('Grado','debe ser numerico').isNumeric(),
    validarCampos
], alumnosPost )
router.delete('/:Id',[
    validarJWT,
    check('Id','Debe ser numerico').isNumeric()
],alumnosDelete)
module.exports = router
    