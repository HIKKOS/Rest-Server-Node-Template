const { Router } = require('express')
const { check } = require('express-validator')

const { loginAdmin, loginTutor, verificarJWT } = require('../controllers/auth')
const {validarCampos} = require('../middlewares/validadorCampos')
const { validarJWT } = require('../middlewares/validarJWT')

const router = Router()

router.post('/admin',[
    check('Correo','tiene que ser un correro').isEmail(),
    check('Password','debe escribir algo').not().isEmpty(),
    validarCampos
], loginAdmin)
router.post('/jwt',verificarJWT)
router.post('/Tutor',
    [check('Correo','tiene que ser un correro').isEmail(),
    check('Password','debe escribir algo').not().isEmpty(),
],loginTutor)
module.exports = router