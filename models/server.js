const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc  = require("swagger-jsdoc");
const { dbConnection } = require("../DB/config");
const  { swaggerSpec }  = require('../helpers/swaggerSpec.js')
class Server {
	constructor() {
		this.app = express();
		this.port = process.env.PORT;
		this.paths = {
			auth: "/api/login",
			usersPath: "/api/users",
			uploads: "/api/uploads",
			fotos: "/api/fotos",
			servicios: "/api/servicios",
			tutores: "/api/tutores",
			alumnos: "/api/alumnos",
			busqueda: "/api/buscar",
			pagos: "/api/pagos",
			suscripciones: "/api/contratar",
			renovar: "/api/renovar",
			paypal: "/api/test-paypal",
		};
		//Middlewares
		this.middlewares();
		//rutas de mi apliacion
		this.routes();
		//conectar a la base de datos
		//this.conectarDb()
	}
	async conectarDb() {
		await dbConnection();
	}
	middlewares() {
		//directorio publico
		//this.app.use(express.static("public"));
		
		//cors
		this.app.use(cors());
		//lectura y parse del body
		this.app.use(express.json());
		//file uploads
		this.app.use(
			fileUpload({
				useTempFiles: true,
				tempFileDir: "/tmp/",
				createParentPath: true,
			}),
		);
        this.app.use(
			"/api-doc",
			swaggerUI.serve,
			swaggerUI.setup(swaggerJsDoc(swaggerSpec)),
		);
	}
	routes() {
		this.app.use(this.paths.auth, require("../routes/auth"));
		this.app.use(this.paths.usersPath, require("../routes/users"));
		this.app.use(this.paths.uploads, require("../routes/uploads"));
		this.app.use(this.paths.servicios, require("../routes/servicios"));
		this.app.use(this.paths.tutores, require("../routes/tutores"));
		this.app.use(this.paths.alumnos, require("../routes/alumnos"));
		this.app.use(this.paths.busqueda, require("../routes/busqueda"));
		this.app.use(this.paths.fotos, require("../routes/FotosTutores"));
		this.app.use(this.paths.pagos, require("../routes/pagos"));
		this.app.use(this.paths.suscripciones, require("../routes/contratar-servicio"));
		this.app.use(this.paths.renovar, require("../routes/renovar-servicio"));
		this.app.use(this.paths.paypal, require("../routes/paypal-test"));
	}
	listen() {
		this.app.listen(this.port, () => {
			console.log(`escuchando en el puerto: ${this.port}`);
		});
	}
}
module.exports = Server;
