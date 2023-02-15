const { Router } = require("express");
const { check } = require("express-validator");

const {
	tutoresGet,
	tutoresPost,
	tutoresPut,
	tutoresGetById,
	tutoresDelete,
} = require("../controllers/tutores");
const {
	validarPaginacion,
	validarCampos,
	validarJWT,
} = require("../middlewares");
const router = Router();
/**
 * @swagger
 * components:
 *  securitySchemes:
 *    JWT:    
 *      type: apiKey
 *      in: header
 *      name: x-token
 *  security:
 *     - JWT: [] 
 *  schemas:
 *    Tutor:
 *      type: object
 *      properties:
 *        Id:
 *          type: string
 *          description: id del tutor
 *        Nombres:
 *          type: string
 *          description: nombre del tutor
 *        ApellidoMaterno:
 *          type: string
 *          description: apellido materno del tutor
 *        ApellidoPaterno:
 *          type: string
 *          description: apellido paterno del tutor
 *        Correo:
 *          type: string
 *          description: correo del tutor
 *        Telefono:
 *          type: string
 *          description: telefono del tutor
 *        RFC:
 *          type: string
 *          description: RFC del tutor
 *        PasswordTutor:
 *          type: string
 *          description: contraseña del tutor
 *        Direccion:
 *          type: string
 *          description: direccion del tutor
 *        Activo:
 *          type: boolean
 *          description: estado del tutor
 *        MetodoPago:
 *          type: string
 *          description: metodo de pago del tutor
 *      required: 
 *        - Id	
 *        - Nombres
 *        - ApellidoMaterno
 *        - ApellidoPaterno
 *        - Correo
 *        - Telefono
 *        - PasswordTutorrequired: 
 *        - Id	
 *        - Nombres
 *        - ApellidoMaterno
 *        - ApellidoPaterno
 *        - Correo
 *        - Telefono
 *        - PasswordTutor
 *      example:
 *        Id: abc12
 *        Nombres: "Juan"
 *        ApellidoMaterno: "Perez"
 *        ApellidoPaterno: "Perez"
 *        Correo: "juan@gmail.com"
 *        Telefono: "1234567890"
 *        PasswordTutor: "abc12345"
 * /api/Tutores:
 *   get:
 *     summary: obtiene la lista de tutores
 *     description: obtiene la lista de tutores
 *   post:
 *     security:
 *       - JWT: [] 
 *     summary: crear tutor
 *     tags: [Tutor]
 *     requestBody:
 *       required: true
 *       content: 
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#/components/schemas/Tutor'
 *     responses:
 *       200:
 *          description: tutor creado
 *       400:
 *         description: tutor no creado
 *   put:
 *     summary: Edita un tutor 
 *     description: Edita un tutor 
 *   delete:
 *     summary: Elimina un nuevo tutor 
 *     description: Elimina un nuevo tutor 
 * 
 * 
*/
router.get("/", [validarJWT, validarPaginacion, validarCampos], tutoresGet);
router.get("/:id", [validarJWT, validarCampos], tutoresGetById);
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
