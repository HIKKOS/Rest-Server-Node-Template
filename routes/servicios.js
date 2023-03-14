const { Router } = require('express')
const { check } = require('express-validator')

const { 
    validarCampos, 
    validarJWT,
    validarPaginacion,
    
} = require('../middlewares')
const { 
    serviciosGet, serviciosPost, serviciosPut, serviciosDel, serviciosGetById, getServicioById,
} = require('../controllers/servicios')
const { ExisteNombreServicio, validarColecciones, ExisteServicio } = require('../helpers/DataBaseValidator')
const { verifyAdminRole } = require('../middlewares/verifyRole')
const { VerificarHorario } = require('../helpers/verificarHorario')

const router = Router()


router.get('/', [
    validarJWT,
    validarPaginacion, 
    validarCampos,
],serviciosGet)
router.get('/GetById/:ServicioId', [
    validarJWT,
    validarPaginacion, 
    validarCampos,
    check('ServicioId', 'es obligatorio').notEmpty(),
    check('ServicioId').custom( ExisteServicio )
],getServicioById)
router.post('/',[
    validarJWT,
    verifyAdminRole,
    check('Nombre').custom( ExisteNombreServicio ).isLength({min:1}),
    check('Descripcion','Se requiere este campo').isLength({min:1}),
    check('Cancelable','De ser booleano (true/false 1/0)').isBoolean(),
    check('Horarios').custom( VerificarHorario ),
    check('Costo','Debe ser numerico y mayor a 0').not().isIn([0]).isNumeric(),
    validarCampos,
] ,serviciosPost)

router.put('/:Id',[
    validarJWT,
    check('Nombre','no debe ser vacio').notEmpty(),
    check('Descripcion','Se requiere este campo').notEmpty(),
    check(['Cancelable'],'De ser booleano (true/false 1/0)').isBoolean(),
    check('Costo','Debe ser numerico').isNumeric(),
    check('Horarios').custom( VerificarHorario ),
    check('FrecuenciaDePago','No es valido').isIn(["SEMANAL","MENSUAL" ,"BIMESTRAL", "SEMESTRAL", "ANUAL"]),
    check('Id','No existe').custom(  ExisteServicio ),
    validarCampos
],serviciosPut)
router.delete('/:Id',[
    validarJWT,
    check('Id','No existe').custom(  ExisteServicio ),
    validarCampos
],serviciosDel)
module.exports = router