const { Router } = require('express')
const { check } = require('express-validator')

const { 
    busquedaGet,
} = require('../controllers/busqueda')
const { validarPaginacion, validarCampos, validarJWT } = require('../middlewares')

const router = Router()
router.get('/',[
    validarJWT,
    validarPaginacion, 
    validarCampos
],busquedaGet )

module.exports = router
    