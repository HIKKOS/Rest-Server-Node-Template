const { request, response } = require("express");
const bcryptjs = require("bcryptjs");
const { generarJWT } = require("../helpers/jwtGenerator");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
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
		const {Id,CreatedAt,Activo, PasswordTutor, ...resto } = user;

		const tutor = resto
		console.log(tutor)
		//generar el JWT
		const jwt = await generarJWT(user.Id,'Tutor');
		res.json({
			tutor,
			jwt,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			msg: "ocurrio un error",
		});
	}
};
module.exports = {
	loginAdmin,
	loginTutor,
};
