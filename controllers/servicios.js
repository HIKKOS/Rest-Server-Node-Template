const { response, request } = require("express");
const { PrismaClient } = require("@prisma/client");
const { evaluarPagina } = require("../helpers/paginacion");
const { v4: uuidv4 } = require("uuid");
const { tieneDuplicados } = require("../helpers/verificar-valores-unicos");

const prisma = new PrismaClient();
const getServicioById = async (req = request, res = response) => {
	const { ServicioId } = req.params;
	const Servicio = await prisma.servicio.findUnique({
		where: {
			Id: ServicioId,
		},
	});
	const horarios = await prisma.horarioServicio.findMany({
		where: {
			ServicioId,
		},
		select: {
			Dia: true,
			HoraInicio: true,
			HoraFin: true,
		},
	});
	Servicio.Horario = horarios;
	return res.json(Servicio);
};
const serviciosGet = async (req = request, res = response) => {
	const { dataFor = "mobile" } = req.query;
	switch (dataFor.toLocaleLowerCase()) {
		case "web":
			serviciosGetWeb(req, res);
			break;
		default:
			serviciosGetMobile(req, res);
	}
};
const serviciosGetMobile = async (req = request, res = response) => {
	const { page, limit } = req.query;
	const { Id = "" } = req.query;
	let { show = "active" } = req.query;
	show === "" ? (show = "active") : null;
	if (show !== "disabled") {
		show = "active";
	}
	try {
		const Horario = await prisma.horarioServicio.findMany({
			where: {
				ServicioId: Id,
			},
		});
		const { skip, limite } = await evaluarPagina(page, limit);
		let Servicios = await prisma.servicio.findMany({
			skip,
			take: limite,
			select: {
				Id: true,
				Nombre: true,
				Costo: true,
				ImgPaths: {
					select: {
						Id: true,
					},
				}
			},
			where: {
				Activo: show === "active" ? true : false,
			},
		});
		Servicios = Servicios.map( s => {
			let Paths = s.ImgPaths;
			Paths = Paths.map( p => Object.values(p))
			s.ImgPaths = Paths 
			return s
		})  
		const total = await prisma.Servicio.count();
		res.json({
			total,
			Servicios,
		});
	} catch (error) {
		console.log(error);
		res.status(400).json({
			error,
		});
	}
};
const serviciosGetWeb = async (req = request, res = response) => {
	const { page, limit } = req.query;
	const { Id = "" } = req.query;
	let { show = "active" } = req.query;
	show === "" ? (show = "active") : null;
	if (show !== "disabled") {
		show = "active";
	}
	try {
		if (Id !== "") {
			const Servicio = await prisma.Servicio.findUnique({
				where: {
					Id: Id,
				},
			});
			const PathsArray = await prisma.ImgPaths.findMany({
				where: { ServicioId: Servicio.Id },
			});
			const ImgId = PathsArray.map((p) => {
				return p.Id;
			});
			Servicio.ImgIds = ImgId;

			if (!Servicio) {
				return res.status(400).json({ msg: "No existe ese Servicio" });
			}
			return res.json(Servicio);
		}
		const { skip, limite } = await evaluarPagina(page, limit);
		const Servicios = await prisma.Servicio.findMany({
			skip,
			take: limite,
			where: {
				Activo: show === "active" ? true : false,
			},
		});
		for (const Servicio of Servicios) {
			const ServicioId = Servicio.Id;
			const PathsArray = await prisma.ImgPaths.findMany({
				where: { ServicioId },
			});
			const Id = PathsArray.map((p) => {
				return p.Id;
			});
			Servicio.ImgIds = Id;
			if (PathsArray.length >= 0) {
				Servicios.ImgIds = "";
			}
			Servicios.ImgIds = Id;
		}

		const total = await prisma.Servicio.count();
		res.json({
			total,
			Servicios,
		});
	} catch (error) {
		console.log(error);
		res.status(400).json({
			error,
		});
	}
};
const serviciosPost = async (req = request, res = response) => {
	let { Nombre, Cancelable, Descripcion, FechaPago, Costo } = req.body;
	const { Horarios } = req.body;
	const horarioServicio = [];
	horarioServicio.
	Cancelable = Boolean(Cancelable);
	Costo = Number(Costo);
	const Id = uuidv4();
	const data = Horarios
	if(tieneDuplicados(data)){
		return res.status(400).json({msg: 'tiene valores duplicados'})
	}
	for (const horario of Horarios) {
		if (horario.inicio >= horario.fin) {
			return res.status(400).json({
				msg: "La hora de inicio debe ser menor a la de fin se obtuvo:",
				incio: horario.inicio,
				fin: horario.fin,
			});
		}
		
		if (isNaN(horario.inicio || horario.fin)) {
			return res.status(400).json({
				msg: "deben ser numericos se obtuvo:",
				incio: horario.inicio,
				fin: horario.fin,
			});
		}

		horarioServicio.push({
			ServicioId: Id,
			Id: uuidv4(),
			Dia: horario.dia.toUpperCase(),
			HoraInicio: Number(horario.inicio),
			HoraFin: Number(horario.fin),
		});
	}
	const [Servicio, Horario] = await prisma.$transaction([
		prisma.Servicio.create({
			data: {
				Id,
				Nombre,
				Cancelable,
				Descripcion,
				FechaPago,
				Costo,
			},
		}),
		prisma.horarioServicio.createMany({
			data: horarioServicio,
		}),
	]);

	res.json({
		msg: "ServiciosPost - controlador",
		Servicio,
		Horario,
	});
};
const serviciosPut = async (req = request, res = response) => {
	const { Id } = req.params;
	const data = req.body;
	console.log(data);
	data.Costo = Number(data.Costo);
	data.Cancelable = Boolean(data.Cancelable);

	const serv = await prisma.Servicio.update({
		data,
		where: { Id },
	});
	return res.json({
		Servicio: serv,
	});
};
const serviciosDel = async (req = request, res = response) => {
	const { Id } = req.params;
	const Servicio = await prisma.Servicio.delete({ where: { Id: Number(Id) } });
	return res.json({
		msg: `el Servicio ${Servicio.Nombre} se ha dado de baja `,
	});
};

module.exports = {
	serviciosGet,
	serviciosPost,
	serviciosPut,
	serviciosDel,
	getServicioById,
};
