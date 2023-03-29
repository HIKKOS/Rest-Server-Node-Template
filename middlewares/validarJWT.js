const { PrismaClient } = require("@prisma/client");
const { response, request } = require("express");

const jwt = require("jsonwebtoken");

const model = require("../models/server");

const prisma = new PrismaClient();
const validarJWT = async (req , res , next) => {
	const token = req.header("x-token");
	if (!token) {
		return res.status(401).json({
			msg: "no hay token en la peticion",
		});
	}
	try {
		const { Id } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
		req.id = Id;
		next();
	} catch ( error ) {
		switch (error.name) {
			case 'TokenExpiredError':
				return res.status(401).json({msg:'Token expirado'})		
			case 'JsonWebTokenError':
				return res.status(401).json({msg:'Error de formato'})		
			default:
				res.status(400).json({
					msg:message
				});
		}
		
	}
};

module.exports = {
	validarJWT,
};
