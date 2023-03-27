const { response, request } = require("express");

const { PrismaClient } = require("@prisma/client");
const { evaluarPagina } = require("../helpers/paginacion");
const { all } = require("../routes/auth");
const { getImgIdsFromService } = require("../helpers/obenterIdImagenes");
const prisma = new PrismaClient();

const busquedaServicios = async (req = request, res = response) => {
	console.log("busqueda");
	const { dataFor = "" } = req.query;
	if (dataFor.toUpperCase() === "WEB") {
		busquedaWeb(req, res);
	} else {
		busquedaMobile(req, res);
	}
};

const busquedaAlumnos = async (req = request, res = response) => {
	const {
		showOnly = "noTutor",
		page,
		limit,
		Grado,
		Grupo,
		Alumno: query = "",
	} = req.query;

	const { skip, limite } = await evaluarPagina(page, limit);

	const where = {
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
	console.log(showOnly);
	console.log(showOnly === "withTutor");
	showOnly === "withTutor"
		? where.AND.push({ TutorId: { not: null } })
		: where.AND.push({ TutorId: null });
	console.log(where);
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
	if (Grado && Grupo) {
		where.AND.push({
			Grupo: Grupo.charAt(0),
		});
		where.AND.push({
			Grado: Number(Grado),
		});
	}

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
		tutores,
	});
};
const busquedaWeb = async (req = request, res = response) => {
	console.log("busqueda web");
	const { Servicio: query = "" } = req.query;
	console.log(query);
	const { page, limit } = req.query;
	try {
		const { skip, limite } = await evaluarPagina(page, limit);

		const allServicios = await prisma.servicio.findMany({
			where: {
				Nombre: {
					startsWith: query,
				},
			},
			select: {
				Id: true,
				Nombre: true,
				Costo: true,
				Cancelable: true,
				Descripcion: true,
				HorarioServicio: {
					select: {
						Dia: true,
						Fin: true,
						Inicio: true,
					},
				},
			},
			skip,
			take: limite,
		});

		if (allServicios.length === 0) {
			return res.json(allServicios);
		}
		res.json({
			total: allServicios.length,
			servicios: allServicios,
		});
	} catch (error) {
		return res.status(400).json({
			error,
		});
	}
};
const busquedaPagos = async (req = request, res = response) => {
	const { Tutor: query = "" } = req.query;
	const { page, limit } = req.query;
	try {
		const { skip, limite } = await evaluarPagina(page, limit);
		const allPagos = await prisma.pago.findMany({
			take: limite,
			skip,
			where: {
				Tutor: {
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
				},
			},
			select: {
				Servicio: {
					select: {
						Nombre: true,
					},
				},
				Monto: true,
				Tutor: {
					select: {
						PrimerNombre: true,
						ApellidoPaterno: true,
					},
				},

				Facturar: true,
				AlumnoId: true,
				Folio: true,
				FechaPago: true,
			},
		});

		const totalPagos = allPagos.map((pago) => ({
			folio: pago.Folio,
			fechaPago: pago.FechaPago,
			servicio: pago.Servicio.Nombre,
			monto: pago.Monto,
			facturado: pago.Facturar,
			Tutor: `${pago.Tutor.PrimerNombre} ${pago.Tutor.ApellidoPaterno}`,
			AlumnoId: pago.AlumnoId,
		}));
		for (const pago of totalPagos) {
			const alumno = await prisma.alumno.findUnique({
				where: {
					Id: pago.AlumnoId,
				},
				select: {
					PrimerNombre: true,
					ApellidoPaterno: true,
				},
			});
			pago.alumno = `${alumno.PrimerNombre} ${alumno.ApellidoPaterno}`;
			pago.AlumnoId = undefined;
		}
		res.json({
			total: totalPagos.length,
			pagos: totalPagos,
		});
	} catch (error) {
		return res.status(400).json({
			error,
		});
	}
};
const busquedaMobile = async (req = request, res = response) => {
	console.log("busqueda mobile");
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
	busquedaPagos,
};
