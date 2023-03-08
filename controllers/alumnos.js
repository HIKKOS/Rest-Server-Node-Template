const { response, request } = require("express");
const { v4: uuidv4 } = require("uuid");
const { PrismaClient } = require("@prisma/client");
const { evaluarPagina } = require("../helpers/paginacion");
const { reduceName } = require("../helpers/reduceName");
const prisma = new PrismaClient();
const alumnosGet = async (req = request, res = response) => {
	const { AlumnoId = "" } = req.query;
	if (AlumnoId !== "") {
		const Alumno = await prisma.alumno.findUnique({
			where: {
				Id: AlumnoId,
			},
		});
		if (!Alumno) {
			return res.status(400).json(`no existe el alumno con id: ${Id}`);
		}
	}

	let { show = "active" } = req.query;
	if (show !== "active") {
		show = "disabled";
	}
	const { page, limit } = req.query;
	const { skip, limite } = await evaluarPagina(page, limit);

	const total = await prisma.alumno.count();
	const Alumnos = await prisma.alumno.findMany({
		skip,
		take: limite,
		where: {
			Activo: show === "active" ? true : false,
		},
	});
	const data = Alumnos.map((a) => {
		const { CreatedAt, Activo, ...resto } = a;
		return resto;
	});
	return res.json({
		total,
		Alumnos: data,
	});
};
const alumnosPut = async (req = request, res = response) => {
	let alumno = {};
	console.log(req.body);
	const { Id } = req.params;
	const {
		TutorId,
		PrimerNombre,
		SegundoNombre,
		ApellidoMaterno,
		ApellidoPaterno,
		Grado,
		Grupo,
		Genero,
	} = req.body;

	if (!TutorId) {
		alumno = {
			PrimerNombre,
			SegundoNombre,
			ApellidoMaterno,
			ApellidoPaterno,
			Grado: Number(Grado),
			Grupo,
			Genero: Genero ? 0 : 1,
		};
	} else {
		const tutor = await prisma.tutor.findUnique({ where: { Id: TutorId } });
		if (!tutor) {
			return res
				.status(400)
				.json({ msg: `No existe el tutor con id ${TutorId}` });
		}
		alumno = {
			TutorId: TutorId,
			PrimerNombre,
			SegundoNombre,
			ApellidoMaterno,
			ApellidoPaterno,
			Grado: Number(Grado),
			Grupo,
			Genero: Genero ? 0 : 1,
		};
	}
	const resp = await prisma.alumno.update({ where: { Id }, data: alumno });
	return res.json({
		resp,
	});
};
const alumnosPost = async (req = request, res = response) => {
	const { Nombres, ApellidoMaterno, ApellidoPaterno, Grado, Grupo, Genero } =
		req.body;
	const Id = uuidv4();
	//! TODO: FUNCION PARA VALIDAR NOMBRES SIN ESPACIOS
	const alumno = await prisma.alumno.create({
		data: {
			Id,
			Nombres,
			ApellidoPaterno,
			ApellidoMaterno,
			Grado: Number(Grado),
			Grupo,
			Genero: Genero === 0 ? 0 : "1",
		},
	});
	return res.json({
		alumno,
	});
};
const alumnosDelete = async (req = request, res = response) => {
	const { Id } = req.params;
	const alumno = await prisma.alumno.findUnique({ where: { Id: Number(Id) } });
	if (!alumno) {
		return res.status(400).json({
			msg: `no existe el Id ${Id}`,
		});
	}
	await prisma.alumno.update({
		where: { Id: Number(Id) },
		data: { Activo: false },
	});
	return res.json({
		alumno,
	});
};
const getServiciosDelAlumnoForWeb = async(req = request, res = response)=>{
	const { IdAlumno } = req.params;
	const { page, limit } = req.query;
	const { skip, limite } = await evaluarPagina(page, limit);
	let data = await prisma.serviciosDelAlumno.findMany({
		skip,
		take: limite,
		where: {
			AlumnoId: IdAlumno,
		},
		select: {
			FechaExpiracion: true,
			Servicio: {
				select: {
					Nombre: true,
					Costo: true,
				},
			},
		},
	});
	const servicios = data.map( s => ({
		Nombre: s.Servicio.Nombre,
		Costo: s.Servicio.Costo,
		Expirado: s.FechaExpiracion < new Date(),
		FechaExpiracion: s.FechaExpiracion,
		DiasRestantes: s.FechaExpiracion < new Date() ? 0 :Math.ceil((s.FechaExpiracion - new Date()) / (1000 * 60 * 60 * 24))
	}))
	res.status(200).json( {servicios} );
}
const getServiciosDelAlumno = async (req = request, res = response) => {
	const { IdAlumno } = req.params;
	const { page, limit } = req.query;
	const { skip, limite } = await evaluarPagina(page, limit);
	let data = await prisma.serviciosDelAlumno.findMany({
		skip,
		take: limite,
		where: {
			AlumnoId: IdAlumno,
		},
		select: {
			FechaExpiracion: true,
			Servicio: {
				select: {
					Id:true,
					Nombre: true,
					Costo: true,
				},
			},
		},
	});
	const servicios = data.map( s => ({
		Id: s.Servicio.Id,
		Nombre: s.Servicio.Nombre,
		Costo: s.Servicio.Costo,
		Expirado: s.FechaExpiracion < new Date(),
		FechaExpiracion: new Date(s.FechaExpiracion),
		DiasRestantes: s.FechaExpiracion < new Date() ? 0 :Math.ceil((s.FechaExpiracion - new Date()) / (1000 * 60 * 60 * 24))
	}))
	res.status(200).json( {servicios} );
};
const getHorarioServicioAlumno = async (req = request, res = response) => {
	const servicio = await prisma.servicio.findUnique({
		where: {
			Id: req.params.ServicioId,
		},
		select: {
			Nombre: true,
		},
	});

	const horario = await prisma.horarioServicioAlumno.findMany({
		where: {
			AlumnoId: req.params.AlumnoId,
			ServicioId: req.params.ServicioId,
		},
		select: {
			Dia: true,
			HoraInicio: true,
			HoraFin: true,
		},
	});
	return res.status(200).json({ servicio: servicio.Nombre, horario });
};
module.exports = {
	alumnosGet,
	alumnosPost,
	alumnosPut,
	alumnosDelete,
	getServiciosDelAlumno,
	getHorarioServicioAlumno,
};
