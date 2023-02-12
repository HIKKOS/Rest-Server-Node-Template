const { Router } = require('express')
const { check } = require('express-validator')
const { MostrarImagenTutor, cargarArchivo, RemoveImagenTutor } = require('../controllers/fotoTutor')
const {validarCampos, validarCargaArchivos, validarJWT} = require('../middlewares')

const router = Router()
router.get('/:IdTutor',[
    validarJWT,
    check('IdTutor','No ser recibio este campo').notEmpty(),  
    validarCampos,     
],MostrarImagenTutor) 
router.post('/:IdTutor',[
    validarJWT,
    validarCargaArchivos,
    validarCampos,
], cargarArchivo)
router.delete('/:IdTutor',[
    validarJWT,
    validarCampos,
], RemoveImagenTutor)
module.exports = router