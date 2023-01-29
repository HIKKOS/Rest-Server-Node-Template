const { Router } = require("express");
const { check } = require("express-validator");

const {
	tutoresGet,
	tutoresPost,
	tutoresPut,
	tutoresGetById,
} = require("../controllers/tutores");
const {
	validarPaginacion,
	validarCampos,
	validarJWT,
} = require("../middlewares");
const { existeCorreo } = require("../helpers/DataBaseValidator");
const { verifyAdminRole } = require("../middlewares/validarRol");

const router = Router();
router.get(
	"/",
	[validarJWT, verifyAdminRole, validarPaginacion, validarCampos],
	tutoresGet,
);
router.get("/:id", [validarJWT, validarCampos,verifyAdminRole], tutoresGetById);
router.put(
	"/:id",
	[
		validarJWT,
		verifyAdminRole,
		check("id", "el id debe ser numerico").isNumeric(),
		validarCampos,
	],
	tutoresPut,
);
router.post(
	"/",
	[
		validarJWT,
		verifyAdminRole,
		check("Correo", "No tiene el formato de un correo").isEmail(),
		check("Correo").custom(existeCorreo),
		check("Nombres", "No debe ser vacio").notEmpty(),
		check("ApellidoPaterno", "No debe ser vacio").notEmpty(),
		check("ApellidoMaterno", "No debe ser vacio").notEmpty(),
		check("Nombres", "No debe ser vacio").notEmpty(),
		check("Telefono", "debe ser de almenos 10 digitos y numerico")
			.isLength({ min: 10 })
			.isNumeric(),
		check("RFC", "debe tener 12 caracteres").isLength({ min: 12 }),
		check("Password", "deben ser minimo 8 caracteres").isLength({ min: 8 }),
		validarCampos,
	],
	tutoresPost,
);
module.exports = router;
