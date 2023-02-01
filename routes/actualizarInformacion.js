const { Router } = require("express");
const { check } = require("express-validator");
const {actualizarDatos, actualizarTelefono, actualizarFotoTutor} = require('../controllers/actualizarInformacion')
const {
	validarCampos,
    verifyUserRole,
	validarJWT,
    validarCargaArchivos,
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
router.post('/Password', [
    validarJWT,
    verifyUserRole,
    check('Password','Debe contener al menos 8 caracteres').isLength({min:8}),
    validarCampos,
],actualizarDatos);
router.post('/Foto/:Id',[
    validarJWT,
    verifyUserRole,
    validarCargaArchivos,
    validarCampos,
],actualizarFotoTutor)
module.exports = router;
