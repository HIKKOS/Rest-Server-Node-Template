const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const { response, request } = require("express");
const { uploadFile } = require("../helpers");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const cargarArchivo = async (req = require, res = response) => {
	console.log(req.files);
	const token = req.header("x-token");
	const { Id: IdTutor } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
	const tutor = await prisma.tutor.findUnique({ where: { Id: IdTutor } });
	if (!tutor) {
		return res.status(400).json({
			msg: `No existe una el tutor con id ${IdTutor}`,
		});
	}
	try {
		if (tutor.Foto) {
			const pathImg = path.join(
				__dirname,
				"../uploads/Tutores",
				tutor.Foto == null ? "" : tutor.Foto,
			);
			if (fs.existsSync(pathImg)) {
				fs.unlinkSync(pathImg);
			}
		}
		const dir = await uploadFile(req.files, undefined, "Tutores");
		const archivo = await prisma.tutor.update({
			where: { Id: IdTutor },
			data: {
				Foto: dir,
			},
		});
		res.status(201).json({
			msg: `se subio la foto ${archivo.Foto}`,
		});
	} catch (error) {
		console.log(error);
		res.status(400).json({ error });
	}
};
const MostrarImagenTutor = async (req = request, res = response) => {
	const { TutorId } = req.params;
	const tutor = await prisma.tutor.findUnique({ where: { Id: TutorId } });
	if (!tutor?.Foto || tutor?.Foto == null) {
		const pathImagen = path.join(__dirname, "../assets/no-image.jpg");
		return res.sendFile(pathImagen);
	}
	const pathImagen = path.join(__dirname, "../uploads/Tutores", tutor?.Foto);
	console.log(pathImagen);
	if (!fs.existsSync(pathImagen)) {
		const pathImagen = path.join(__dirname, "../assets/no-image.jpg");
		return res.sendFile(pathImagen);
	}
	return res.sendFile(pathImagen);
};
const RemoveImagenTutor = async (req = request, res = response) => {
	const { IdTutor } = req.params;
	const tutor = await prisma.tutor.findUnique({ where: { Id: IdTutor } });
	if (!tutor) {
		return res.status(400).json({
			msg: `No existe una el tutor con id ${IdTutor}`,
		});
	}
	const pathImg = path.join(__dirname, "../uploads/Tutores", tutor.Foto);
	try {
		if (fs.existsSync(pathImg)) {
			fs.unlinkSync(pathImg);
		}
	} catch (error) {
		console.log(error);
	}

	return res.json({ msg: "Eliminado" });
};

module.exports = {
	MostrarImagenTutor,
	cargarArchivo,
	RemoveImagenTutor,
};
