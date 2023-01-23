const { Router } = require('express')
const { check } = require('express-validator')
const { login } = require('../controllers/auth')
const {validarCampos} = require('../middlewares/validadorCampos')
const router = Router()

router.post('/login',[
    check('Correo','tiene que ser un correro').isEmail(),
    check('Password','debe escribir algo').not().isEmpty(),
    validarCampos
], login)
module.exports = router