const { Router } = require('express')
const { check } = require('express-validator')
const { cargarArchivo,  actualizarImagen, MostrarImagen, deleteImagen } = require('../controllers/uploads')
const { ExisteImg, ExisteServicio,validarColecciones} = require('../helpers/DataBaseValidator')
const {validarCampos, validarCargaArchivos, validarJWT} = require('../middlewares')

const router = Router()
router.get('/:ServicioId/:Id',[
   // validarJWT,
    check('ServicioId','no se recibio').notEmpty(),
    check('ServicioId').custom( ExisteServicio ),
    check('Id','No ser recibio este campo').notEmpty(),
    check('Id').custom( ExisteImg ),
    validarCampos,     
],MostrarImagen) 

router.post('/:ServicioId',[
    validarJWT,
    validarCargaArchivos,
    validarCampos,
], 
cargarArchivo )
router.put('/:ServicioId/:Id', [
    validarJWT,
    validarCargaArchivos,
    check('Id','no se recibio').notEmpty(),
    check('ServicioId','no se recibio').notEmpty(),
    check(['Id']).custom( (Id, { req }) => ExisteImg(Id,req) ),
    validarCampos,     
], actualizarImagen)
router.delete('/:ServicioId/:Id', [
    validarJWT,
    check('Id','No ser recibio este campo').notEmpty(),
    check('Id').custom(ExisteImg),
    check('ServicioId','no se recibio').notEmpty(),
    check('ServicioId').custom(ExisteServicio),
    validarCampos,     
], deleteImagen)




module.exports = router



