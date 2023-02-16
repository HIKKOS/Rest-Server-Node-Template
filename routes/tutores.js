const { Router } = require("express");
const { check } = require("express-validator");
const {
	verifyAdminRole,
	verifyUserRole,
} = require("../middlewares/verifyRole");

const {
	tutoresGet,
	tutoresGetById,
	tutoresPost,
	tutoresPut,
	tutoresDelete,
} = require("../controllers/tutores");
const {
	validarPaginacion,
	validarCampos,
	validarJWT,
} = require("../middlewares");
const router = Router();
router.get(
	"/",
	[validarJWT, verifyAdminRole, validarPaginacion, validarCampos],
	tutoresGet,
);
router.get(
	"/getInfo",
	[validarJWT, verifyUserRole, validarPaginacion, validarCampos],
	tutoresGetById,
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
