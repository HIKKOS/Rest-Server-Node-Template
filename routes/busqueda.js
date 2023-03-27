const { Router } = require('express')
const { check } = require('express-validator')

const { 
    busquedaGet, busquedaServicios, busquedaAlumnos, busquedaTutores, busquedaPagos,
} = require('../controllers/busqueda')
const { validarPaginacion, validarCampos, validarJWT } = require('../middlewares')
const { verifyAdminRole, verifyUserRole } = require('../middlewares/verifyRole')

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
], busquedaAlumnos )
router.get('/Tutores',[
    validarJWT,
    verifyAdminRole,
    validarPaginacion, 
    validarCampos
],busquedaTutores )
router.get('/Pagos',[
    validarJWT,
    verifyUserRole,
    validarPaginacion, 
    validarCampos
],busquedaPagos )

module.exports = router
    