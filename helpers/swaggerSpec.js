const path = require("path");
const swaggerSpec = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "API PaySchool",
			version: "1.0.0",
		},
		host: "localhost:3000",
		servers: [
			{
				url: "http://localhost:8080",
				description: 'Local server',
			},
		],
	},
	apis: [ `${path.join(__dirname,'../routes/*.js')}`, `${path.join(__dirname,'../controllers/*.js')}`],
};
module.exports = {
	swaggerSpec,
};
