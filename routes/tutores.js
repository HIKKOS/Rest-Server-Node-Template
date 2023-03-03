const { Router } = require("express");
const { check } = require("express-validator");
const { verificarJWT } = require("../controllers/auth");

const {
	tutoresGet,
	tutoresPost,
	tutoresPut,
	tutoresDelete,
	getTutoradosWeb,
	getTutoradosMobil,
	getTutorInfo,
	tutoresPutForWeb,
	tutoresPutForMobile,
	solicitarCambioPassword,
	agregarTutorados,
} = require("../controllers/tutores");
const { ExisteTutor, ExistenAlumnos } = require("../helpers/DataBaseValidator");
const {
	validarPaginacion,
	validarCampos,
	validarJWT,
} = require("../middlewares");
const {
	verifyUserRole,
	verifyAdminRole,
} = require("../middlewares/verifyRole");
const router = Router();

router.get(
	"/",
	[
		validarJWT,
		verifyAdminRole,
		validarPaginacion,
		verifyAdminRole,
		validarCampos,
	],
	tutoresGet,
);
router.get(
	"/tutorados",
	//! roles verificar
	[validarJWT, verifyUserRole, validarPaginacion, validarCampos],
	getTutoradosMobil,
);
router.get(
	"/tutorados/web/:TutorId",
	//! roles verificar
	[validarJWT, validarPaginacion,check('TutorId').custom(ExisteTutor), validarCampos],
	getTutoradosWeb,
);
router.get("/getInfo", [validarJWT, verifyUserRole], getTutorInfo);
router.put(
	"/web/:IdTutor",
	[
		validarJWT,
		verifyAdminRole,
		check("IdTutor").custom(ExisteTutor),
		check("Correo", "debe ser un correo").isEmail(),
		check("PrimerNombre", "no debe ser vacio").notEmpty(),
		check("SegundoNombre", "Se requiere este campo").notEmpty(),
		check("ApellidoMaterno", "Se requiere este campo").notEmpty(),
		check("ApellidoPaterno", "Se requiere este campo").notEmpty(),
		check("Telefono", "Se requiere este campo").notEmpty(),
		validarCampos,
	],
	tutoresPutForWeb,
);
router.put(
	"/mobile",
	[
		validarJWT,
		verifyUserRole,
		check("Correo", "debe ser un correo").isEmail(),
		check("PrimerNombre", "no debe ser vacio").notEmpty(),
		check("SegundoNombre", "Se requiere este campo").notEmpty(),
		check("ApellidoMaterno", "Se requiere este campo").notEmpty(),
		check("ApellidoPaterno", "Se requiere este campo").notEmpty(),
		check("Telefono", "Se requiere este campo").notEmpty(),
		check("Direccion", "Se requiere este campo").notEmpty(),
		validarCampos,
	],
	tutoresPutForMobile,
);
router.put(
	"/agregar-tutorados",
	[
		validarJWT,
		verifyAdminRole,
		check("TutorId").custom(ExisteTutor),
		check("tutorados", "debe ser un arreglo").isArray(),
		check("tutorados").custom(ExistenAlumnos),
		validarCampos,
	],
	agregarTutorados,
);
router.post(
	"/update-password",
	[
		validarJWT,
		check("password", "se requiere este campo").notEmpty(),
		validarCampos,
	],
	solicitarCambioPassword,
);
router.post(
	"/",
	[
		validarJWT,
		verifyAdminRole,
		check("Correo", "debe ser un correo").isEmail(),
		check("PrimerNombre", "no debe ser vacio").notEmpty(),
		check("SegundoNombre", "Se requiere este campo").notEmpty(),
		check("ApellidoMaterno", "Se requiere este campo").notEmpty(),
		check("ApellidoPaterno", "Se requiere este campo").notEmpty(),
		check("Telefono", "Se requiere este campo").notEmpty(),
		check("PasswordTutor", "Se requiere este campo").notEmpty(),
		check("Direccion", "Se requiere este campo").notEmpty(),
		validarCampos,
	],
	tutoresPost,
);
router.delete(
	"/:Id",
	[validarJWT, check("Id", "se requiere este campo").notEmpty(), validarCampos],
	tutoresDelete,
);
module.exports = router;
