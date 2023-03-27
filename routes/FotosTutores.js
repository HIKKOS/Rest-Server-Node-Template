const { Router } = require('express')
const { check } = require('express-validator')
const { MostrarImagenTutor, cargarArchivo, RemoveImagenTutor } = require('../controllers/fotoTutor')
const { ExisteTutor } = require('../helpers/DataBaseValidator')
const {validarCampos, validarCargaArchivos, validarJWT} = require('../middlewares')
const { verifyUserRole } = require('../middlewares/verifyRole')

const router = Router()
router.get('/:TutorId',check('TutorId').custom(ExisteTutor),MostrarImagenTutor) 
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