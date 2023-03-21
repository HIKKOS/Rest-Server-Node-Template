const { PrismaClient } = require("@prisma/client");
const { request } = require("express");
const jwt = require("jsonwebtoken");

const prisma = new PrismaClient();

const ExisteServicio = async (Id) => {
	const servicio = await prisma.servicio.findUnique({ where: { Id } });
	if (!servicio) {
		throw new Error(`No existe el servicio con el Id: ${Id}`);
	}
	return true;
};

const estaExpiradoServicioAlumno = async (AlumnoId, req) => {
	const { IdServicio: ServicioId, IdAlumno } = req.params;

	const servicioAlumno = await prisma.serviciosDelAlumno.findUnique({
		where: {
			AlumnoId_ServicioId: {
				AlumnoId: IdAlumno,
				ServicioId,
			},
		},
	});
	if (servicioAlumno) {
		throw new Error("ya esta contratado");
	}
};
const ExisteAlumno = async (Id) => {
	const alumno = await prisma.alumno.findUnique({ where: { Id } });
	if (!alumno) {
		throw new Error(`No existe el alumno con el Id: ${Id}`);
	}
	return true;
};
const ExisteTutor = async (IdTutor) => {
	if (!IdTutor) {
		throw new Error("No se recibio el parametro TutorId");
	}
	if (!isNaN(IdTutor)) {
		throw new Error("El parametro TutorId no debe ser un numerico");
	} else {
		const tutor = await prisma.tutor.findUnique({ where: { Id: IdTutor } });
		if (!tutor) {
			throw new Error(`No existe el tutor con el Id: ${IdTutor}`);
		}
	}
	return true;
};
const ExistenAlumnos = async (ids = []) => {
	for (const id of ids) {
		const a = await prisma.alumno.findUnique({
			where: { Id: id },
		});
		if (!a) {
			throw new Error(`No existe el alumno con el Id: ${id}`);
		}
	}
	return true;
};
const ExisteNombreServicio = async (Nombre = "") => {
	const servicio = await prisma.servicio.findMany();
	const names = servicio.map((s) => {
		return s.Nombre.toUpperCase();
	});
	if (names.includes(Nombre.toUpperCase())) {
		throw new Error(`Ya existe el servicio con el nombre: ${Nombre}`);
	}
	return true;
};
const getColeciones = async () => {
	const servicios = await prisma.servicio.findMany();
	const colecciones = servicios.map((s) => {
		return s.Nombre;
	});
	return colecciones;
};
const ExisteImg = async (Id) => {
	const img = await prisma.imgPaths.findUnique({ where: { Id } });
	if (!img) {
		throw new Error(`No existe una imagen con Id: ${Id}`);
	}
	return true;
};
const ExisteCorreo = async (Correo, req = request) => {
	const token = req.header('x-token')
	const { Id } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

	const tutor = await prisma.tutor.findUnique({ where: { Id } });
	const correo = await prisma.tutor.findUnique({ where: { Correo } });
	if (!correo) {
		return true;
	}
	if (correo.Id !== tutor.Id) {
		throw new Error("ya existe ese correo");
	}

	return true;
};
const validarColecciones = async (coleccion = "", coleciones = []) => {
	coleciones = await getColeciones();
	//TODO: VERFICAR LA COLLECION CON EL INCLUDES
	const incluida = coleciones.includes(coleccion);
	if (!incluida) {
		throw new Error(
			`la coleccion ${coleccion} no existe, colecciones: ${coleciones}`,
		);
	}
	return true;
};

module.exports = {
	ExisteServicio,
	ExisteAlumno,
	ExisteImg,
	validarColecciones,
	ExisteNombreServicio,
	ExisteTutor,
	ExistenAlumnos,
	ExisteCorreo,
	estaExpiradoServicioAlumno,
};
