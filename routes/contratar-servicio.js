const { Router } = require("express");
const { check } = require("express-validator");
const { contratarServicio } = require("../controllers/contratar-servicio");
const { getCorrectDateTime } = require("../helpers/getCorrectDateTime");
const {
	ExisteServicio,
	ExisteAlumno,
	estaExpiradoServicioAlumno,
} = require("../helpers/DataBaseValidator");
const { VerificarHorario } = require("../helpers/verificarHorario");
const {
	validarPaginacion,
	validarCampos,
	genderCheck,
	validarJWT,
} = require("../middlewares");
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
		check("VecesContratado", "es obligatorio").notEmpty(),
		check("AlumnoId", "error").custom((AlumnoId, { req }) =>
			estaExpiradoServicioAlumno(AlumnoId, req),
		),
		validarCampos,
	],
	contratarServicio,
);
module.exports = router;
