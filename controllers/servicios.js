const { response, request } = require("express");
const { PrismaClient } = require("@prisma/client");
const { evaluarPagina } = require("../helpers/paginacion");
const { v4: uuidv4 } = require("uuid");
const { tieneDuplicados } = require("../helpers/verificar-valores-unicos");
const { getImgIdsFromService } = require("../helpers/obenterIdImagenes");

const prisma = new PrismaClient();
const getServicioById = async (req = request, res = response) => {
	const { ServicioId } = req.params;
	let Servicio = await prisma.servicio.findUnique({
		where: {
			Id: ServicioId,
		},
		select: {
			Id: true,
			Nombre: true,
			Cancelable: true,
			Descripcion: true,
			Costo: true,
			FrecuenciaDePago: true,
			HorarioServicio: true,
			ImgPaths: {
				select: {
					Id: true,
				},
			},
		},
	});
	Servicio.ImgPaths = Servicio.ImgPaths.map((p) => {
		const [path] = Object.values(p);
		return path;
	});

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
				},
			},
			where: {
				Activo: show === "active" ? true : false,
			},
		});
		Servicios = getImgIdsFromService(Servicios);
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
		const Servicios = await prisma.servicio.findMany({
			skip,
			take: limite,
			where: {
				Activo: show === "active" ? true : false,
			},
			select: {
				Id: true,
				Nombre: true,
				Cancelable: true,
				Descripcion: true,
				FechaPago: true,
				Costo: true,
				Activo: true,
				FrecuenciaDePago: true,
				ImgPaths: {
					select: {
						Id: true,
					},
				},
				HorarioServicio: {
					select: {
						Dia: true,
						Inicio: true,
						Fin: true,
					},
				},
			},
		});
		const filtrado = Servicios.map((s) => {
			s.ImgPaths = s.ImgPaths.flatMap((p) => Object.values(p));
			return s;
		});

		const total = await prisma.Servicio.count();
		res.json({
			total,
			Servicios: filtrado,
		});
	} catch (error) {
		console.log(error);
		res.status(400).json({
			error,
		});
	}
};
const serviciosPost = async (req = request, res = response) => {
	let { Nombre, Cancelable, Descripcion, FechaPago = 1, Costo } = req.body;
	const { Horarios = [] } = req.body;
	const horarioServicio = [];
	horarioServicio.Cancelable = Boolean(Cancelable);
	Costo = Number(Costo);
	const Id = uuidv4();
	const data = Horarios.map((h) => ({
		Id: uuidv4(),
		//	ServicioId: Id,
		Dia: h.Dia,
		HoraInicio: h.Inicio,
		HoraFin: h.Fin,
	}));

	const [Servicio, Horario] = await prisma.$transaction([
		prisma.servicio.create({
			data: {
				Id,
				Nombre,
				Cancelable,
				Descripcion,
				FechaPago,
				Costo,
				HorarioServicio: {
					createMany: {
						data,
					},
				},
			},
		}),
	]);

	res.json({
		msg: "ServiciosPost - controlador",
		Servicio,
		Horario,
	});
};
const serviciosPut = async (req = request, res = response) => {
	console.log(req.body);
	const { Id } = req.params;
	const { HorarioServicio, ...data } = req.body;


	const dataHorario = HorarioServicio.map(h => ({
		Id: uuidv4(),
		ServicioId: Id,
		...h
	}))
	console.log(data);
	data.Costo = Number(data.Costo);
	data.Cancelable = Boolean(data.Cancelable);
	 const serv = await prisma.servicio.update({
		data,
		where: { Id },
	}); 
	const trans = await prisma.$transaction([
		prisma.horarioServicio.deleteMany({where:{ServicioId:Id}}),
		prisma.horarioServicio.createMany({data:dataHorario})
	])
	const hor = await prisma.horarioServicio.findMany({
		where:{
			ServicioId: Id
		}
	})
	console.log(hor);
	return res.status(200).json({
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
