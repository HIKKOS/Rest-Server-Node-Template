const { Router } = require('express')
const { check } = require('express-validator')

const { 
    validarCampos, 
    validarJWT,
    validarPaginacion,
} = require('../middlewares')
const { 
    pagosGet, pagosPost, pagosPut, pagosDel,
} = require('../controllers/pagos')
const { validarColecciones } = require('../helpers/DataBaseValidator')

const router = Router()

router.get('/', [
],pagosGet)

router.post('/',[

] ,pagosPost)
/* 
router.put('/:Id',[
],pagosPut)
router.delete('/:Id',[

],pagosDel) */

module.exports = router