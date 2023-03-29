const { response, request } = require("express");
const fs = require("fs");
const ejs = require("ejs");
const { v4: uuidv4 } = require("uuid");
const nodemailer = require("nodemailer");
const bcryptjs = require("bcryptjs");
const HOST = process.env.HOST;
const { PrismaClient } = require("@prisma/client");
const { evaluarPagina } = require("../helpers/paginacion");
const jwt = require("jsonwebtoken");
const prisma = new PrismaClient();

const getTutorInfo = async (req = request, res = response) => {
	const token = req.header("x-token");
	const { Id } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
	const { Activo, CreatedAt, PasswordTutor, ...tutor } =
		await prisma.tutor.findUnique({
			where: {
				Id,
			},
		});
	if (!tutor.Foto) {
		tutor.Foto = "";
	}

	!tutor.SegundoNombre
		? (tutor.SegundoNombre = "nada")
		: (tutor.SegundoNombre = tutor.SegundoNombre);
	return res.json(tutor);
};
const tutoresGet = async (req = request, res = response) => {
	const { page, limit } = req.query;
	try {
		const { skip, limite } = await evaluarPagina(page, limit);
		const total = await prisma.tutor.count({ where: { Activo: true } });
		const allUsers = await prisma.tutor.findMany({
			skip,
			take: limite,
			where: {
				Activo: true,
			},
		});
		const tutores = allUsers.map((t) => {
			const { PasswordTutor, CreatedAt, MetodoPago, Activo, ...resto } = t;
			return resto;
		});

		res.json({
			total: total,
			Tutores: tutores,
		});
	} catch (error) {
		return res.status(400).json({
			error,
		});
	}
};
const tutoresPutForWeb = async (req = request, res = response) => {
	const { TutorId } = req.params;
	const data = req.body;
	console.log(data);
	console.log(data.Correo);
	await prisma.tutor.update({
		where: {
			Id: TutorId,
		},
		data,
	});
	return res.json(data);
};
const tutoresPutForMobile = async (req = request, res = response) => {
	const token = req.header("x-token");
	const { Id } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
	const data = req.body;
	try {
		await prisma.tutor.update({
			where: { Id },
			data: req.body,
		});
		return res.status(200).json({ msg: "datos actualizados correctamente" });
	} catch (error) {
		console.log(error);
		return res
			.status(400)
			.json({ msg: "error al actualizar los datos del tutor" });
	}
};

const solicitarCambioPassword = async (req = request, res = response) => {
	const token = req.header("x-token");
	const { Id } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
	const { passwordActual, nuevaPassword } = req.body;
	const tutor = await prisma.tutor.findUnique({
		where: { Id },
		select: {
			PasswordTutor: true,
		},
	});
	if (!bcryptjs.compareSync(passwordActual, tutor.PasswordTutor)) {
		return res.status(401).json({ msg: "La contraseñas no es coinciden" });
	}
	await prisma.tutor.update({
		where: { Id },
		data: { PasswordTutor: bcryptjs.hashSync(nuevaPassword, 10) },
	});

	res.status(200).json({ msg: "Contraseña actualizada con éxito" });
};
const tutorCambioPassword = async (req = request, res = response) => {
	const token = req.header("x-token");
	const { Id } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
	const { PasswordTutor } = req.body;
	const tutor = await prisma.tutor.findUnique({ where: { Id } });
	const salt = bcryptjs.genSaltSync();
};
const tutoresPost = async (req, res = response) => {
	const {
		PrimerNombre,
		SegundoNombre,
		ApellidoMaterno,
		ApellidoPaterno,
		Correo,
		RFC,
		Telefono,
		PasswordTutor,
		Direccion,
	} = req.body;

	const Id = uuidv4();

	const pass = PasswordTutor.toString();
	const existe = await prisma.tutor.findUnique({ where: { Correo } });
	if (existe) {
		return res.status(400).json({ msg: `Ya existe el correo: ${Correo}` });
	}
	const salt = bcryptjs.genSaltSync();
	const tutor = await prisma.tutor.create({
		data: {
			Id,
			PrimerNombre,
			SegundoNombre,
			ApellidoPaterno,
			ApellidoMaterno,
			Correo,
			Telefono,
			RFC: RFC || "",
			Foto: "",
			PasswordTutor: bcryptjs.hashSync(pass, salt),
			Direccion,
		},
	});
	const mailOptions = {
		mail: Correo,
		password: pass,
		nombreTutor: `${PrimerNombre} ${SegundoNombre} ${ApellidoPaterno} ${ApellidoMaterno}`,
	};
	sendMail(req, res, mailOptions);
};
const tutoresDelete = async (req = request, res = response) => {
	const { Id } = req.params;
	try {
		await prisma.tutor.update({
			where: { Id },
			data: { Activo: false },
		});
		return res.json({
			msg: "elimidado correctamente",
		});
	} catch (error) {
		console.log(error);
	}
};

const getTutoradosWeb = async (req = request, res = response) => {
	const { TutorId = "" } = req.params;
	const Alumnos = await prisma.alumno.findMany({
		where: {
			TutorId,
			Activo: true,
		},
	});
	if (Alumnos.length <= 0) {
		return res.json({ tutorados: [] });
	}
	const data = Alumnos.map((a) => {
		const { CreatedAt, Activo, TutorId, ...resto } = a;
		return resto;
	});
	return res.json({ tutorados: data });
};
const getTutoradosMobil = async (req, res) => {
	const token = req.header("x-token");
	const { Id } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

	const Alumnos = await prisma.alumno.findMany({
		where: {
			TutorId: Id,
			Activo: true,
		},
	});
	if (Alumnos.length <= 0) {
		return res.status(404).json({ msg: "no tienes tutorados" });
	}
	const data = Alumnos.map((a) => {
		const { CreatedAt, Activo, TutorId, ...resto } = a;
		return resto;
	});
	return res.json({ tutorados: data });
};
const agregarTutorados = async (req, res) => {
	const { TutorId, tutorados = [] } = req.body;
	console.log(TutorId, tutorados);
	try {
		for (const id of tutorados) {
			await prisma.alumno.update({
				where: { Id: id },
				data: { TutorId },
			});
		}
		return res.json({ msg: "tutor agregado correctamente" });
	} catch (error) {
		console.log(error);
		return res.status(400).json({ msg: "error al agregar el tutor" });
	}
};
const quitarTutorado = async (req, res) => {
	const { AlumnosIds } = req.body;
	try {
		for (const AlumnoId of AlumnosIds) {
			await prisma.alumno.update({
				where: { Id: AlumnoId },
				data: { TutorId: null },
			});
		}
		return res.json({ msg: "tutor removido correctamente" });
	} catch (error) {
		console.log(error);
		return res.status(400).json({ msg: "error al remover el tutor" });
	}
};
const solicitarCambioCorreo = async (req, res) => {
	const { Correo } = req.body;
	const token = req.header("x-token");
	const { Id } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
	const tutor = await prisma.tutor.findUnique({ where: { Id } });
	if (tutor.Correo === Correo) {
		return res.status(400).json({ msg: "El correo es el mismo" });
	}
	cambioCorreo({ newMail: Correo, oldMail: tutor.Correo, res });
};
const sendMail = async (req, res, mailInfo) => {
	const { mail, password: PasswordTutor, nombreTutor } = mailInfo;
	const email = process.env.EMAIL;
	const password = process.env.PASSWORD;
	const transporter = nodemailer.createTransport({
		host: "smtp.gmail.com",
		port: 465,
		secure: false,
		service: "gmail",
		authMethod: "PLAIN",
		auth: {
			user: email,
			pass: password,
		},
	});
	const mailOptions = {
		from: email,
		to: mail,
		subject: "Credenciales de acceso",
		html: `<h1> Estimado ${nombreTutor}</h1>
		<p>Por este medio le hacemos llegar las credenciales para poder acceder a la aplicación "PaySchool" </p>
		<p>Correo: ${mail}</p>
		<p>Contraseña: ${PasswordTutor}</p>
		`,
	};
	transporter.sendMail(mailOptions, (err, info) => {
		if (err) {
			console.log(err);
		}
	});
	return res.json({ msg: `correo enviado correctamente al ${mail}` });
};

const cambioCorreo = ({ oldMail, newMail, res }) => {
	const email = process.env.EMAIL;
	const password = process.env.PASSWORD;
	const transporter = nodemailer.createTransport({
		host: "smtp.gmail.com",
		port: 465,
		secure: false,
		service: "gmail",
		authMethod: "PLAIN",
		auth: {
			user: email,
			pass: password,
		},
	});
	const payload = { oldMail, newMail };
	const token = jwt.sign(payload, process.env.SECRETORPRIVATEKEY, {
		expiresIn: "1h",
	});
	const confirmUrl = `${HOST}/api/tutores/confirmar-correo?token=${token}`;
	const mailOptions = {
		from: email,
		to: newMail,
		subject: "Cambio de correo",
		html: `<h1>Se ha solicitado un cambio de correo</h1>
		<p>Si no has solicitado este cambio, por favor ignora este correo</p>
		<a href=${confirmUrl}><button>Confirmar email</button></a>
		`,
	};
	transporter.sendMail(mailOptions, (err, info) => {
		if (err) {
			console.log(err);
		} else {
			console.log(`Email sent: ${info.response}`);
		}
	});
	return res.json({ msg: `correo enviado correctamente al ${newMail}` });
};
const FinalizarCambioCorreo = async (req, res) => {
	const { token = "" } = req.query;
	if (token === "") {
		return res.status(400).json({ msg: "no se ha enviado el token" });
	}
	try {
	const { oldMail, newMail } = jwt.verify(
		token,
		process.env.SECRETORPRIVATEKEY,
	);
		console.log({ oldMail, newMail });
		await prisma.tutor.update({
			where: { Correo: oldMail },
			data: { Correo: newMail },
		});
		fs.readFile("./templates/CambioCorreoExistoso.ejs", "utf8", (err, data) => {
			if (err) {
				console.log(err);
				return res
					.status(500)
					.send("Ocurrió un error al procesar la solicitud.");
			}
			const html = ejs.render(data, {
				correoNuevo: newMail,
			});
			return res.send(html);
		});
	} catch (error) {
		console.log(error);
		return res.status(400).json({ msg: "error al cambiar el correo" });
	}
};
const cambioCorreov1 = async (req, res) => {
	const { Correo } = req.body;
	const token = req.header("x-token");
	const { Id } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
	try {
		await prisma.tutor.update({
			where: { Id },
			data: { Correo },
		});
		return res.json({ msg: "correo cambiado correctamente" });
	} catch (error) {
		console.log(error);
		return res.status(400).json({ msg: "error al cambiar el correo" });
	}
};

const getPagos = async (req = request, res = response) => {
	const { page, limit } = req.query;
	const token = req.header("x-token");
	const { Id } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
	const { skip, limite } = await evaluarPagina(page, limit);
	const pagos = await prisma.pago.findMany({
		where: {
			TutorId: Id,
		},
		orderBy: {
			FechaPago: "desc",
		},
		skip,
		take: limite,
		select: {
			Servicio: {
				select: {
					Id: true,
					Nombre: true,
					ImgPaths: {
						select: {
							Id: true,
						},
					},
				},
			},
			Monto: true,
			Facturar: true,
			AlumnoId: true,
			Folio: true,
			FechaPago: true,
		},
	});
	const totalPagos = [];
	for (const pago of pagos) {
		const alumno = await prisma.alumno.findUnique({
			where: {
				Id: pago.AlumnoId,
			},
			select: {
				PrimerNombre: true,
				SegundoNombre: true,
			},
		});

		const imgPaths = pago.Servicio.ImgPaths.map((p) => {
			const [path] = Object.values(p);
			return path;
		});

		const p = {
			folio: pago.Folio,
			fechaPago: pago.FechaPago,
			servicio: pago.Servicio.Nombre,
			servicioId: pago.Servicio.Id,
			monto: pago.Monto,
			facturado: pago.Facturar,
			alumno: `${alumno.PrimerNombre} ${alumno.SegundoNombre}`,
			imgPaths: imgPaths,
		};

		totalPagos.push(p);
	}
	return res.json({
		pagos: totalPagos,
	});
};

module.exports = {
	quitarTutorado,
	getPagos,
	tutoresGet,
	tutoresDelete,
	tutoresPost,
	tutoresPutForWeb,
	tutoresPutForMobile,
	getTutorInfo,
	solicitarCambioPassword,
	agregarTutorados,
	getTutoradosWeb,
	getTutoradosMobil,
	cambioCorreov1,
	solicitarCambioCorreo,
	FinalizarCambioCorreo,
};
