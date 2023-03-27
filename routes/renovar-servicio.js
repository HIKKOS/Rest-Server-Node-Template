const { Router } = require("express");
const { check } = require("express-validator");
const { contratarServicio } = require("../controllers/contratar-servicio");
const { renovarServicio } = require("../controllers/renovar-servicio");
const {
	ExisteServicio,
	ExisteAlumno,
} = require("../helpers/DataBaseValidator");
const { VerificarHorario } = require("../helpers/verificarHorario");
const { validarCampos, validarJWT } = require("../middlewares");
const { verifyUserRole } = require("../middlewares/verifyRole");

const router = Router();
router.post(
	"/:ServicioId/:AlumnoId",
	[
		validarJWT,
		verifyUserRole,
		check("ServicioId", "es obligatorio").notEmpty(),
		check("ServicioId").custom(ExisteServicio),
		check("AlumnoId").custom(ExisteAlumno),
		check("AlumnoId", "es obligatorio").notEmpty(),
		check("VecesContratado", "es obligatorio").notEmpty().isNumeric({}),
		validarCampos,
	],
	renovarServicio,
);
module.exports = router;
