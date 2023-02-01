const { Router } = require('express')
const { check } = require('express-validator')
const { cargarArchivo,  actualizarImagen,actualizarIcon, MostrarImagen, deleteImagen, MostrarIcon } = require('../controllers/uploads')
const { ExisteImg, ExisteServicio,validarColecciones} = require('../helpers/DataBaseValidator')
const {validarCampos, validarCargaArchivos, validarJWT} = require('../middlewares')
const { verifyAdminRole } = require('../middlewares/validarRol')

const router = Router()
router.get('/:Servicio/Icon',[
    //validarJWT,
    check('Servicio').custom(s => validarColecciones(s, ['servicios'])), 
    validarCampos,     
],MostrarIcon) 
router.get('/:Servicio/:Id',[
    //validarJWT,
    //verifyAdminRole,
    check('Id','Debe ser numerico').isNumeric(),
    //check('Id').custom( ExisteImg ),
    check(['Id']).custom( (Id, { req }) => ExisteImg(Id,req) ),
    check('Servicio').custom(s => validarColecciones(s, ['servicios'])), 
    validarCampos,     
],MostrarImagen) 



router.post('/:Servicio',[
    validarJWT,
    verifyAdminRole,
    validarCargaArchivos,
    check('Servicio').custom(s => validarColecciones(s, ['servicios'])), 
    validarCampos,
], 
cargarArchivo )

router.put('/:Servicio/Icon', [
    validarJWT,
    verifyAdminRole,
    validarCargaArchivos,
    check('Servicio','No existe').custom(s => validarColecciones(s) ),
    validarCampos,     
], actualizarIcon)
router.put('/:Servicio/:Id', [
    validarJWT,
    verifyAdminRole,
    validarCargaArchivos,
    check('Id','Debe ser numerico').isNumeric(),
    check('Servicio','No existe').custom(s => validarColecciones(s) ),
    check(['Id']).custom( (Id, { req }) => ExisteImg(Id,req) ),
    validarCampos,     
], actualizarImagen)

router.delete('/:Servicio/:Id', [
    validarJWT,
    verifyAdminRole,
    check('Id','Debe ser numerico').isNumeric(),
    check('Servicio','No existe').custom(s => validarColecciones(s) ),
    check(['Id']).custom( (Id, { req }) => ExisteImg(Id,req) ),
    validarCampos,     
], deleteImagen)

module.exports = router
