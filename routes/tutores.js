const { Router } = require("express");
const { check } = require("express-validator");
const { verificarJWT } = require("../controllers/auth");
const { getPagos } = require("../controllers/pagos");

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
	quitarTutorado,
	solicitarCambioCorreo,
	FinalizarCambioCorreo,
	cambioCorreov1,
} = require("../controllers/tutores");
const {
	ExisteTutor,
	ExistenAlumnos,
	ExisteAlumno,
	ExisteCorreo,
} = require("../helpers/DataBaseValidator");
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
router.delete(
	"/:Id",
	[
		validarJWT,
		verifyAdminRole,
		check("Id", "se requiere este campo").notEmpty(),
		check("Id").custom(ExisteTutor),
		validarCampos,
	],
	tutoresDelete,
);
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
	[validarJWT, verifyUserRole, validarPaginacion, validarCampos],
	getTutoradosMobil,
);
router.get(
	"/tutorados/web/:TutorId",
	//! roles verificar
	[
		validarJWT,
		validarPaginacion,
		check("TutorId").custom(ExisteTutor),
		validarCampos,
	],
	getTutoradosWeb,
);
router.get("/getInfo", [validarJWT, verifyUserRole], getTutorInfo);
router.put(
	"/web/:TutorId",
	[
		validarJWT,
		verifyAdminRole,
		check("TutorId").custom(ExisteTutor),
		check("Correo", "debe ser un correo").isEmail(),
		check("Correo", "error").custom((Correo, { req }) =>
			ExisteCorreo(Correo, req),
		),
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
		check("Correo", "error").custom((Correo, { req }) =>
			ExisteCorreo(Correo, req),
		),
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
router.put(
	"/quitar-tutorado",
	[
		validarJWT,
		verifyAdminRole,
		check("AlumnosIds").isArray(),
		check("AlumnosIds").custom(ExistenAlumnos),
		validarCampos,
	],
	quitarTutorado,
);
router.post(
	"/actualizar-password",
	[
		validarJWT,
		verifyUserRole,
		check("passwordActual", "se requiere este campo").notEmpty(),
		check("nuevaPassword", "se requiere este campo").notEmpty(),
		check("nuevaPassword", "debe ser de 8 caracteres").isLength({ min: 8 }),
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
router.post(
	"/solicitar-cambio-correo",
	[
		validarJWT,
		verifyUserRole,
		check("Correo", "debe ser un correo").isEmail(),
		check("Correo", "error").custom((Correo, { req }) =>
			ExisteCorreo(Correo, req),
		),
		validarCampos,
	],
	solicitarCambioCorreo,
);
router.get("/pagos", [validarJWT, verifyUserRole, validarCampos], getPagos);
router.get("/confirmar-correo", FinalizarCambioCorreo);
router.put("/cambio-correo-v1", cambioCorreov1);
router.put(
	"/cambio-correo",
	[check("Correo", "debe ser un correo").isEmail(), validarCampos],
	solicitarCambioCorreo,
);
router.get("/servicios-por-pagar", [validarJWT, validarCampos], getPagos);

module.exports = router;
