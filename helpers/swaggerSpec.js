const path = require("path");
const swaggerSpec = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "API PaySchool",
			version: "1.0.0",
		},
		host: "Producción",
		servers: [
			{
				url: "https://rest-server-node-production-1503.up.railway.app",
				description: 'Local server',
			},
		],
	},
	apis: [ `${path.join(__dirname,'../routes/*.js')}`, `${path.join(__dirname,'../controllers/*.js')}`],
};
module.exports = {
	swaggerSpec,
};
