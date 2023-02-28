const { Router } = require("express");
const { check } = require("express-validator");


const {
	tutoresGet,
	tutoresPost,
	tutoresPut,
	tutoresDelete,
	getTutorados,
	getTutorInfo
} = require("../controllers/tutores");
const {
	validarPaginacion,
	validarCampos,
	validarJWT,
} = require("../middlewares");
const { verifyUserRole, verifyAdminRole } = require("../middlewares/verifyRole");
const router = Router();
router.get(
	"/",
	//! roles verificar
	[validarJWT, validarPaginacion,verifyAdminRole, validarCampos],
	tutoresGet,
);
router.get(
	"/Tutorados",
	//! roles verificar
	[validarJWT, validarPaginacion,verifyUserRole, validarCampos],
	getTutorados,
);
router.get(
	"/getInfo",
	[validarJWT, verifyUserRole],
	getTutorInfo,
);
router.put(
	"/",
	[
		validarJWT,
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
