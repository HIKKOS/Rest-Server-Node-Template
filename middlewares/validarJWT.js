const { PrismaClient } = require("@prisma/client");
const { response, request } = require("express");

const jwt = require("jsonwebtoken");

const model = require("../models/server");

const prisma = new PrismaClient();
const validarJWT = async (req = request, res = response, next) => {
	const token = req.header("x-token");
	if (!token) {
		return res.status(401).json({
			msg: "no hay token en la peticion",
		});
	}
	try {
		const { Id, rol } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
		if (req.baseUrl === "/api/buscar") {
			return next();
		}
		if (req.baseUrl === "/api/pagos") {
			return next();
		}
		if (rol !== "Administrador") {
			return res.status(401).json({
				msg: "no tienes permisos para realizar esta acción",
			});
		}
		req.id = Id;
		const userAuth = await prisma.administrador.findUnique({ where: { Id } });
		req.userAuth = userAuth;
		next();
	} catch (error) {
        let msg = ''
		switch (error) {
			case jwt.TokenExpiredError:
                mgs = 'token expirado'
				break;
			case jwt.JsonWebTokenError:
                msg='error de formato en el token'
				break;
		}
		const {message} = error
		res.status(400).json({
			msg:message
		});
	}
};

module.exports = {
	validarJWT,
};
