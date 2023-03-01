const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const ExisteServicio = async (Id) => {
	const servicio = await prisma.servicio.findUnique({ where: { Id } });
	if (!servicio) {
		throw new Error(`No existe el servicio con el Id: ${Id}`);
	}
	return true;
};
const ExisteAlumno = async (Id) => {
	const alumno = await prisma.alumno.findUnique({ where: { Id } });
	if (!alumno) {
		throw new Error(`No existe el alumno con el Id: ${Id}`);
	}
	return true;
};
const ExisteTutor = async (IdTutor) => {
	const tutor = await prisma.tutor.findUnique({ where: { Id: IdTutor } });
	if (!tutor) {
		throw new Error(`No existe el tutor con el Id: ${Id}`);
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
};
