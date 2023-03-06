const { response, request } = require("express");

const { PrismaClient } = require("@prisma/client");
const { evaluarPagina } = require("../helpers/paginacion");
const { all } = require("../routes/auth");
const { getImgIdsFromService } = require("../helpers/obenterIdImagenes");
const prisma = new PrismaClient();

const busquedaServicios = async (req = request, res = response) => {
	const { dataFor = "" } = req.query;
	if (dataFor.toUpperCase() === "WEB") {
		busquedaWeb(req, res);
	} else {
		busquedaMobile(req, res);
	}
};

const busquedaAlumnos = async (req = request, res = response) => {
	const { page, limit, Grado, Grupo, Alumno: query = "" } = req.query;
	const { skip, limite } = await evaluarPagina(page, limit);
	let where = {
		AND: [],
		OR: [
			{
				PrimerNombre: {
					startsWith: query,
				},
			},
			{
				ApellidoPaterno: {
					startsWith: query,
				},
			},
		],
	};
	if (
		Grado &&
		Grupo &&
		!(
			[1, 2, 3, 4, 5, 6].includes(Number(Grado)) ||
			["A", "B", "C", "D"].includes(Grupo.charAt(0))
		)
	) {
		return res.status(400).json({
			msg: "El grupo debe estar entre A al D y el Grado de 1 al 6",
		});
	}

	if (!Grado && Grupo) {
		where.AND.push({ Grupo: Grupo[0] });
	}
	if (!Grupo && Grado) {
		where.AND.push({ Grado: Number(Grado) });
	}
	if (Grado && Grupo)
		where.AND = [
			{
				Grupo: Grupo.charAt(0),
			},
			{
				Grado: Number(Grado),
			},
		];
	const alumnos = await prisma.alumno.findMany({
		where,
		skip,
		select: {
			Id: true,
			PrimerNombre: true,
			SegundoNombre: true,
			ApellidoMaterno: true,
			ApellidoPaterno: true,
			Grado: true,
			Grupo: true,
			Genero: true,
			Tutor: {
				select: {
					PrimerNombre: true,
					ApellidoPaterno: true,
				},
			},
		},
		take: limite,
	});
	return res.json({
		total: alumnos.length,
		alumnos,
	});
};
const busquedaTutores = async (req = request, res = response) => {
	const { tutor: query = "" } = req.query;
	const { page, limit } = req.query;
	const { skip, limite } = await evaluarPagina(page, limit);
	let tutores = await prisma.tutor.findMany({
		where: {
			OR: [
				{
					PrimerNombre: {
						startsWith: query,
					},
				},
				{
					SegundoNombre: {
						startsWith: query,
					},
				},
				{
					ApellidoPaterno: {
						startsWith: query,
					},
				},
				{
					ApellidoMaterno: {
						startsWith: query,
					},
				},
			],
		},
		skip,
		take: limite,
	});
	tutores = tutores.map((t) => {
		const { PasswordTutor, CreatedAt, MetodoPago, Activo, ...resto } = t;
		return resto;
	});
	return res.json({
		total: tutores.length,
		tutores: tutores.length === 0 ? "sin resultados" : tutores,
	});
};
const busquedaWeb = async (req = request, res = response) => {
	const { servicio: query = "" } = req.query;
	const { page, limit } = req.query;
	try {
		const { skip, limite } = await evaluarPagina(page, limit);
		let allServicios = await prisma.servicio.findMany({
			where: {
				Nombre: {
					startsWith: query,
				},
			},
			skip,
			take: limite,
		});
		for (servicio of allServicios) {
			servicio.Horario = await prisma.horarioServicio.findMany({
				where: {
					ServicioId: servicio.Id,
				},
				select: {
					Dia: true,
					HoraInicio: true,
					HoraFin: true,
				},
			});
		}
		if (allServicios.length === 0) {
			return res.json({
				msg: `no se econtro ningun resultado para ${Servicio}`,
			});
		}
		res.json({
			encontrados: allServicios.length,
			allServicios,
		});
	} catch (error) {
		return res.status(400).json({
			error,
		});
	}
};
const busquedaMobile = async (req = request, res = response) => {
	const { Servicio: query = "" } = req.query;
	const { page, limit } = req.query;
	try {
		const { skip, limite } = await evaluarPagina(page, limit);
		let allServicios = await prisma.servicio.findMany({
			where: {
				Nombre: {
					startsWith: query,
				},
			},
			select: {
				Id: true,
				Nombre: true,
				Costo: true,
				ImgPaths: true,
			},
			skip,
			take: limite,
		});
		allServicios = getImgIdsFromService(allServicios);
		return res.json(allServicios);
	} catch (err) {
		console.log(err);
	}
};
module.exports = {
	busquedaServicios,
	busquedaAlumnos,
	busquedaTutores,
};
