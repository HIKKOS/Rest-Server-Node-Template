const { Router } = require("express");
const { check } = require("express-validator");
const { contratarServicio } = require("../controllers/contratar-servicio");
const { renovarServicio } = require("../controllers/renovar-servicio");
const {
	ExisteServicio,
	ExisteAlumno,
} = require("../helpers/DataBaseValidator");
const { VerificarHorario } = require("../helpers/verificarHorario");
const {
	validarCampos,
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
		check("IdServicio").custom( ExisteServicio ),
		check("IdAlumno").custom( ExisteAlumno ),
		check("IdAlumno", "es obligatorio").notEmpty(),
		check("VecesContratado", "es obligatorio").notEmpty(),
		validarCampos,
	],
	renovarServicio,
);
module.exports = router;
