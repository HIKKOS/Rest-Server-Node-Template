const { request, response } = require("express");
const bcryptjs = require("bcryptjs");
const { generarJWT } = require("../helpers/jwtGenerator");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken')
const loginAdmin = async (req = request, res = response) => {
	const { Correo = "", Password } = req.body;
	try {
		//verificar si el email existe
		const user = await prisma.administrador.findUnique({ where: { Correo } });
		if (!user) {
			return res.status(400).json({
				msg: "usuario o contraseña invalidos",
			});
		}
		//el usuario esta activo?
		if (!user.Activo) {
			return res.status(400).json({
				msg: "no esta activo",
			});
		}

		//verificar contraseña
		const validPassword = bcryptjs.compareSync(
			Password.toString(),
			user.PasswordAdmin,
		);
		if (!validPassword) {
			return res.status(400).json({
				msg: "usuario o contraseña invalidos",
			});
		}
		//generar el JWT
		const jwt = await generarJWT(user.Id,'Administrador');
		res.json({
			jwt
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			msg: "ocurrio un error",
		});
	}
};
const loginTutor = async (req = request, res = response) => {
	const { Correo = "", Password } = req.body;
	try {
		//verificar si el email existe
		const user = await prisma.tutor.findUnique({ where: { Correo } });
		if (!user) {
			return res.status(400).json({
				msg: "usuario o contraseña invalidos",
			});
		}
		//el usuario esta activo?
		if (!user.Activo) {
			return res.status(400).json({
				msg: "no esta activo",
			});
		}

		//verificar contraseña
		const validPassword = bcryptjs.compareSync(
			Password.toString(),
			user.PasswordTutor,
		);
		if (!validPassword) {
			return res.status(400).json({
				msg: "usuario o contraseña invalidos",
			});
		}
		const {CreatedAt,Activo, PasswordTutor, ...resto } = user;
		const jwt = await generarJWT(user.Id,'Tutor');
		res.json({
			jwt,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			msg: "ocurrio un error",
		});
	}
};
const verificarJWT = (req = request, res = response) =>{
	const token = req.header('x-token')
	if (!token) {
		return res.status(401).json({
			msg: "no hay token en la peticion",
		});
	}
	try{
		const { rol } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)
		if(rol !== 'Administrador'){
			return res.status(401).json('sin autorización')
		}
		return res.status(200).json({msg:'ok'})
	} catch (error) {
		const msg = error
		res.status(400).json({
			msg
		});
	}
	
}
const getAdminInfo = async (req = request, res = response) => {
	const token  = req.header('x-token')
	const { Id,rol } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)
	console.log(rol);
	const admin = await prisma.administrador.findUnique({
		where: {
			Id			
		},

	})
	const { PasswordAdmin, Activo, ...resto } = admin
	admin.rol = rol 
	res.status(200).json({
		...resto,
		rol
	})
}
module.exports = {
	loginAdmin,
	loginTutor,
	verificarJWT,
	getAdminInfo
};
