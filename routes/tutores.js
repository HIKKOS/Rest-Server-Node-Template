const { Router } = require('express')
const { check } = require('express-validator')

const { 
    tutoresGet,
    tutoresPost,
    tutoresPut,
    tutoresGetById,
} = require('../controllers/tutores')
const { validarPaginacion, validarCampos, validarJWT } = require('../middlewares')

const router = Router()
router.get('/',[
    validarJWT,
    validarPaginacion, 
    validarCampos
],tutoresGet )
router.get('/:id',[
    validarJWT,
    validarCampos
],tutoresGetById )
router.put('/:id',[
    validarJWT,
    check('id', 'el id debe ser numerico').isNumeric(),
    validarCampos
],tutoresPut )
router.post('/',[
    validarJWT,
    check('Correo').isEmail(),    
    validarCampos
],tutoresPost )

module.exports = router
    