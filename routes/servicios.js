const { Router } = require('express')
const { check } = require('express-validator')

const { 
    validarCampos, 
    validarJWT,
    validarPaginacion,
} = require('../middlewares')
const { 
    serviciosGet, serviciosPost, serviciosPut, serviciosDel, serviciosGetById,
} = require('../controllers/servicios')
const { ExisteNombreServicio, validarColecciones, ExisteServicio } = require('../helpers/DataBaseValidator')

const router = Router()


router.get('/', [
    validarJWT,
    validarPaginacion, 
    validarCampos,
],serviciosGet)
router.post('/',[
    validarJWT,
    check('Nombre').custom( ExisteNombreServicio ).isLength({min:1}),
    check('Descripcion','Se requiere este campo').isLength({min:1}),
    check('Cancelable','De ser booleano (true/false 1/0)').isBoolean(),
    check('Costo','Debe ser numerico y mayor a 0').not().isIn([0]).isNumeric().isLength({min:1}),
    validarCampos,
] ,serviciosPost)

router.put('/:Id',[
    validarJWT,
    check('Nombre','no debe ser vacio').notEmpty(),
    check('Descripcion','Se requiere este campo').notEmpty(),
    check(['Cancelable'],'De ser booleano (true/false 1/0)').isBoolean(),
    check('Costo','Debe ser numerico').isNumeric(),
    check('Id','No existe').custom(  ExisteServicio ),
    validarCampos
],serviciosPut)
router.delete('/:Id',[
    validarJWT,
    check('Id','No existe').custom(  ExisteServicio ),
    validarCampos
],serviciosDel)
module.exports = router