const { Router } = require('express')
const { check } = require('express-validator')
const { cargarArchivo,  actualizarImagen, MostrarImagen } = require('../controllers/uploads')
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

router.put('/:coleccion/:Id', [
    validarJWT,
    validarCargaArchivos,
    check('coleccion').custom(c => validarColecciones(c, ['servicios'])), 
    validarCampos,     
], actualizarImagen)

module.exports = router