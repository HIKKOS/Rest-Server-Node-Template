const { Router } = require('express')
const { check } = require('express-validator')

const { 
    validarCampos, 
    validarJWT,
    validarPaginacion,
} = require('../middlewares')
const { 
    serviciosGet, serviciosPost, serviciosPut, serviciosDel,
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
    check('Nombre').custom( ExisteNombreServicio ),
    check('Descripcion','Se requiere este campo').notEmpty(),
    check('Prioritario','De ser booleano (true/false 1/0)').isBoolean(),
    check('Precio','Debe ser numerico').isNumeric(),
    validarCampos,
] ,serviciosPost)

router.put('/:Id',[
    validarJWT,
    check('Nombre','no debe ser vacio').notEmpty(),
    check('Descripcion','Se requiere este campo').notEmpty(),
    check(['Prioritario'],'De ser booleano (true/false 1/0)').isBoolean(),
    check('Precio','Debe ser numerico').isNumeric(),
    check('Id','No existe').custom(  ExisteServicio ),
    validarCampos
],serviciosPut)
router.delete('/:Id',[
    validarJWT,
    check('Id','No existe').custom(  ExisteServicio ),
    validarCampos
],serviciosDel)

module.exports = router