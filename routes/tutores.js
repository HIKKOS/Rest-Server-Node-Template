const { Router } = require("express");
const { check } = require("express-validator");


const {
	tutoresGet,
	tutoresPost,
	tutoresPut,
	tutoresDelete,
	getTutorados
} = require("../controllers/tutores");
const {
	validarPaginacion,
	validarCampos,
	validarJWT,
} = require("../middlewares");
const router = Router();
router.get(
	"/",
	//! roles verificar
	[validarJWT, validarPaginacion, validarCampos],
	tutoresGet,
);
router.get(
	"/Tutorados",
	//! roles verificar
	[validarJWT, validarPaginacion, validarCampos],
	getTutorados,
);
router.get(
	"/getInfo",
	[validarJWT, validarPaginacion, validarCampos],
	tutoresGet,
);
router.put(
	"/:id",
	[
		validarJWT,
		check("id", "el id debe ser numerico").isNumeric(),
		validarCampos,
	],
	tutoresPut,
);
router.post(
	"/",
	[validarJWT, check("Correo").isEmail(), validarCampos],
	tutoresPost,
);
router.delete(
	"/:Id",
	[validarJWT, check("Id", "debe ser numerico").isNumeric(), validarCampos],
	tutoresDelete,
);

module.exports = router;
