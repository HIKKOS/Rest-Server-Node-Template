const { Router } = require('express')
const { check } = require('express-validator')

const { loginAdmin, loginTutor } = require('../controllers/auth')
const {validarCampos} = require('../middlewares/validadorCampos')

const router = Router()

router.post('/admin',[
    check('Correo','tiene que ser un correro').isEmail(),
    check('Password','debe escribir algo').not().isEmpty(),
    validarCampos
], loginAdmin)
router.post('/Tutor',
    [check('Correo','tiene que ser un correro').isEmail(),
    check('Password','debe escribir algo').not().isEmpty(),
],loginTutor)
module.exports = router