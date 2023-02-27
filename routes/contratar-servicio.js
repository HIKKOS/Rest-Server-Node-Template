const { Router } = require("express");
const { check } = require("express-validator");
const { contratarServicio } = require("../controllers/contratar-servicio");
const {
	validarPaginacion,
	validarCampos,
	genderCheck,
	validarJWT,
} = require("../middlewares");
const { verifyUserRole } = require("../middlewares/verifyRole");

const router = Router();
router.post(
	"/:IdServicio/:IdAlumno",
	[
        validarJWT,
        verifyUserRole,
		check("IdServicio", "es obligatorio").notEmpty(),
		check("IdAlumno", "es obligatorio").notEmpty(),
	],
	contratarServicio,
);
module.exports = router;
