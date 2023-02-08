const { response, request } = require("express");
const { PrismaClient } = require("@prisma/client");
const { evaluarPagina } = require("../helpers/paginacion");
const prisma = new PrismaClient();

const serviciosGet = async (req = request, res = response) => {
	const { page, limit } = req.query;
	let { show = 'active' } = req.query
	show === '' ? show = 'active' : null 
	console.log({show});
	console.log(show.length > 0);
    if( show !== 'disabled'){
        show = 'active'
    }
	console.log({show});
	try {
		const { skip, limite } = await evaluarPagina(page, limit);
		const servicios = await prisma.servicio.findMany({
			skip,
			take: limite,
			where: {
				Activo: show === 'active' ? true : false,
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
		const query = req.query

		res.json({
			total,
			servicios,
		});
	} catch (error) {
		console.log(error);
		res.status(400).json({
			error
		});
	}
};
const serviciosPost = async (req = request, res = response) => {
	let { Nombre, Prioritario, Descripcion, FechaPago, Precio } = req.body;
	Prioritario = Boolean(Prioritario)
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
	const data = req.body;
	data.Activo === 0 ? data.Activo = false : true
	data.Activo = Boolean(data.Activo) 
	data.Precio = Number(data.Precio)
	data.Prioritario === 0 ? data.Prioritario = false : true
	data.Prioritario = Boolean(data.Prioritario) 

	const serv = await prisma.servicio.update({
		data,
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
