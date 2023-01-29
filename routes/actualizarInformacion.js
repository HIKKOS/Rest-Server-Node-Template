const { Router } = require("express");
const { check } = require("express-validator");
const {actualizarDatos, actualizarTelefono} = require('../controllers/actualizarInformacion')
const {
	validarCampos,
    verifyUserRole,
	validarJWT,
} = require("../middlewares");
const { existeCorreo, existeTelefono } = require("../helpers/DataBaseValidator");

const router = Router();

router.post("/correo", [
    validarJWT,
    verifyUserRole,
    check('Correo','debe ser un correo').isEmail(),
    check('Correo').custom( existeCorreo ),
    validarCampos,
],actualizarDatos);
router.post("/Telefono", [
    validarJWT,
    verifyUserRole,
    check('Telefono','debe ser numerico').isNumeric().isLength({min:10, max:10}),
    check('Telefono').custom(existeTelefono),
    validarCampos,
],actualizarDatos);
module.exports = router;
