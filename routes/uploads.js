const { Router } = require('express')
const { check } = require('express-validator')
const { cargarArchivo,  actualizarImagen, MostrarImagen, deleteImagen } = require('../controllers/uploads')
const { validarColecciones } = require('../helpers/DBvalidators')
const {validarCampos, validarCargaArchivos, validarJWT} = require('../middlewares')

const router = Router()
 router.get('/:coleccion/:Id',[
    //validarJWT,
    check('Id','Debe ser numerico').isNumeric(),
    check('coleccion').custom(c => validarColecciones(c, ['servicios'])), 
    validarCampos,     
],MostrarImagen) 
router.post('/:coleccion/:Id',[
    validarJWT,
    validarCargaArchivos,
    check('Id','Debe ser numerico').isNumeric(),
    check('coleccion').custom(c => validarColecciones(c, ['servicios'])), 
    validarCampos,
], 
cargarArchivo )

router.put('/', [
    validarJWT,
    validarCargaArchivos,
    check('Id','Debe ser numerico').isNumeric(),
    check('ServicioId','Debe ser numerico').isNumeric(),
    validarCampos,     
], actualizarImagen)
router.delete('/',[
    validarJWT,
    check('Id','deber ser numerico').isNumeric(),
    check('ServicioId','deber ser numerico').isNumeric(),
    validarCampos,
],deleteImagen)

module.exports = router