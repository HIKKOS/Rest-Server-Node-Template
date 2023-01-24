const { Router } = require('express')
const { check } = require('express-validator')
const { cargarArchivo,  actualizarImagen, MostrarImagen, deleteImagen } = require('../controllers/uploads')
const { ExisteImg, ExisteServicio,validarColecciones} = require('../helpers/DataBaseValidator')
const {validarCampos, validarCargaArchivos, validarJWT} = require('../middlewares')

const router = Router()
 router.get('/:Servicio/:Id',[
    //validarJWT,
    check('Id','Debe ser numerico').isNumeric(),
    check('Id').custom( ExisteImg ),
    check('Servicio').custom(s => validarColecciones(s, ['servicios'])), 
    validarCampos,     
],MostrarImagen) 
router.post('/:Servicio/:Id',[
    validarJWT,
    validarCargaArchivos,
    check('Id','Debe ser numerico').isNumeric(),
    check('Servicio').custom(s => validarColecciones(s, ['servicios'])), 
    validarCampos,
], 
cargarArchivo )

router.put('/:Servicio/:Id', [
    validarJWT,
    validarCargaArchivos,
    check('Id','Debe ser numerico').isNumeric(),
    check('Id').custom( ExisteImg ),
    check('Servicio','No existe').custom(s => validarColecciones(s) ),
    validarCampos,     
], actualizarImagen)
router.delete('/',[
    validarJWT,
    check('Id','deber ser numerico').isNumeric(),
    check('ServicioId','deber ser numerico').isNumeric(),
    validarCampos,
],deleteImagen)

module.exports = router