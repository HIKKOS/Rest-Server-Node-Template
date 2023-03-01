const { Router } = require('express')
const { check } = require('express-validator')
const { MostrarImagenTutor, cargarArchivo, RemoveImagenTutor } = require('../controllers/fotoTutor')
const {validarCampos, validarCargaArchivos, validarJWT} = require('../middlewares')
const { verifyUserRole } = require('../middlewares/verifyRole')

const router = Router()
router.get('/',[
    validarJWT,   
],MostrarImagenTutor) 
router.post('/',[
    validarJWT,
    verifyUserRole,
    validarCargaArchivos,
    validarCampos,
], cargarArchivo)
router.delete('/:IdTutor',[
    validarJWT,
    validarCampos,
], RemoveImagenTutor)
module.exports = router