const { Router } = require('express')
const { check } = require('express-validator')

const { 
    busquedaGet, busquedaServicios, busquedaAlumnos, busquedaTutores,
} = require('../controllers/busqueda')
const { validarPaginacion, validarCampos, validarJWT } = require('../middlewares')
const { verifyAdminRole } = require('../middlewares/verifyRole')

const router = Router()
router.get('/Servicios',[
    validarJWT,
    validarPaginacion, 
    validarCampos
],busquedaServicios )
router.get('/Alumnos',[
    validarJWT,
    verifyAdminRole,
    validarPaginacion, 
    validarCampos
],busquedaAlumnos )
router.get('/Tutores',[
    validarJWT,
    verifyAdminRole,
    validarPaginacion, 
    validarCampos
],busquedaTutores )

module.exports = router
    