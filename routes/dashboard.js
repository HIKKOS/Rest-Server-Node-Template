const { Router } = require("express");
const { check } = require("express-validator");
const { getIngresos, getCantidadServicos } = require("../controllers/dashboard");
const { validarJWT, validarCampos } = require("../middlewares");
const { verifyAdminRole } = require("../middlewares/verifyRole");
const router = Router();
router.get('/resumen-servicios',[
    validarJWT,
    verifyAdminRole,
    validarCampos
],)
router.get('/ingresos/por-rango/:from/:to',[
    validarJWT,
    verifyAdminRole,
    check('from', 'debe ser una fecha').isDate(),
    check('to', 'debe ser una fecha').isDate(),
    validarCampos
],getIngresos)
router.get('/servicios/por-rango/:from/:to',[
    validarJWT,
    verifyAdminRole,
    check('from', 'debe ser una fecha').isDate(),
    check('to', 'debe ser una fecha').isDate(),
    validarCampos
],getCantidadServicos)
module.exports = router;
