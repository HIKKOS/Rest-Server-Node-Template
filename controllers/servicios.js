const { response, request } = require("express");
const { PrismaClient } = require("@prisma/client");
const { evaluarPagina } = require("../helpers/paginacion");
const prisma = new PrismaClient();

const serviciosGet = async (req = request, res = response) => {
	const { page = 1, limit } = req.query;
	try {
		const { skip, pagina, limite } = await evaluarPagina(page, limit);
		let servicios = await prisma.servicio.findMany({
			skip,
			take: limite,
		});
		servicios = servicios.map((s) => {
			if (s.Activo) {
				return s;
			}
		});
		for (let i = 0; i < servicios.length; i++) {
			const ServicioId = servicios[i].Id;
			const PathsArray = await prisma.imgPaths.findMany({
				where: { ServicioId },
			});
			const Id = PathsArray.map((p) => {
				return p.Id;
			});
			servicios[i].ImgIds = Id;
		}
		const total = await prisma.servicio.count();
		res.json({
			/*      pagina,
            skip,
            limite,
            total, */
			total,
			servicios,
		});
	} catch (error) {
		console.log(error);
		res.status(400).json({
			error,
		});
	}
};
const serviciosPost = async (req = request, res = response) => {
	let { Nombre, Prioritario = "", Descripcion, FechaPago, Precio } = req.body;
	Prioritario ? (Prioritario = true) : (Prioritario = false);
	Precio = Number(Precio);

	const servicio = await prisma.servicio.create({
		data: {
			Nombre,
			Prioritario,
			Descripcion,
			FechaPago,
			Precio,
		},
	});
	res.json({
		msg: "serviciosPost - controlador",
		servicio,
	});
};
const serviciosPut = async (req = request, res = response) => {
	const { Id } = req.params;
	const { Nombre, Prioritario, Descripcion, FechaPago, Precio, Activo } =
		req.body;
	const serv = await prisma.servicio.update({
		data: { Nombre, Prioritario, Descripcion, FechaPago, Precio, Activo },
		where: { Id: Number(Id) },
	});
	return res.json({
		serv,
	});
};
const serviciosDel = async (req = request, res = response) => {
	const { Id } = req.params;
	const servicio = await prisma.servicio.delete({ where: { Id: Number(Id) } });
	return res.json({
		msg: `el servicio ${servicio.Nombre} se ha dado de baja `,
	});
};

module.exports = {
	serviciosGet,
	serviciosPost,
	serviciosPut,
	serviciosDel,
};
