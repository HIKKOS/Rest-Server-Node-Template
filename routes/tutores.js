const { Router } = require('express')
const { check } = require('express-validator')

const { 
    tutoresGet,
    tutoresPost,
    tutoresPut, 
} = require('../controllers/tutores')
const { validarPaginacion, validarCampos } = require('../middlewares')

const router = Router()
router.get('/',[
    validarPaginacion, 
    validarCampos
],tutoresGet )
router.put('/:id',[
    check('id', 'el id debe ser numerico').isNumeric(),
    validarCampos
],tutoresPut )
router.post('/',[
    check('Correo').isEmail(),    
    validarCampos
],tutoresPost )

module.exports = router
    