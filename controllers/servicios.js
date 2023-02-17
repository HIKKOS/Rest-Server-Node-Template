const { response, request } = require("express");
const { PrismaClient } = require("@prisma/client");
const { evaluarPagina } = require("../helpers/paginacion");
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();
const serviciosGetById = async (Id = '') => {	
	return servicio
}
const serviciosGet = async (req = request, res = response) => {
	const { page, limit } = req.query;
	const { Id = '' } = req.query
	let { show = 'active' } = req.query
	show === '' ? show = 'active' : null 
    if( show !== 'disabled'){
		show = 'active'
    }
	try {
		if(Id !== ''){
			const servicio = await prisma.servicio.findUnique({
				where: {
					Id:Id 
				},
			});
			const PathsArray = await prisma.imgPaths.findMany({
				where: { ServicioId : servicio.Id },
			});
				const ImgId = PathsArray.map((p) => {
					return p.Id;
				});
				servicio.ImgIds = ImgId;
			
			if(!servicio) {
				return res.status(400).json({msg: 'No existe ese servicio'})
			}
			return res.json(servicio)
		}
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
	const Id = uuidv4()
	const servicio = await prisma.servicio.create({
		data: {
			Id,
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
	console.log(data);
	data.Precio = Number(data.Precio)
	data.Prioritario === 0 ? data.Prioritario = false : true
	data.Prioritario = Boolean(!data.Prioritario) 

	const serv = await prisma.servicio.update({
		data,
		where: { Id },
	});
	return res.json({
		servicio: serv,
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
	serviciosGetById,
};
