const { response, request } = require("express");
const { PrismaClient } = require("@prisma/client");
const { evaluarPagina } = require("../helpers/paginacion");
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();
const serviciosGet = async (req = request, res = response) => {
	const { dataFor = 'mobile'} = req.query;
	switch ((dataFor).toLocaleLowerCase()) {		
		case 'web': 
			serviciosGetWeb(req, res)
		break;
		default:
			serviciosGetMobile(req, res)
	}
}
const serviciosGetMobile = async (req = request, res = response) => {
	const { page, limit } = req.query;
	const { Id = '' } = req.query
	let { show = 'active' } = req.query
	show === '' ? show = 'active' : null 
    if( show !== 'disabled'){
		show = 'active'
    }
	try {
		if(Id !== ''){
			const Servicio = await prisma.Servicio.findUnique({

				where: {
					Id:Id 
				},
			});
			const PathsArray = await prisma.ImgPaths.findMany({
				where: { ServicioId : Servicio.Id },
			});
			const ImgId = PathsArray.map((p) => {
				return p.Id;
			});
			Servicio.ImgIds = ImgId;
			
			if(!Servicio) {
				return res.status(400).json({msg: 'No existe ese Servicio'})
			}
			return res.json(Servicio)
		}
		const { skip, limite } = await evaluarPagina(page, limit);
		const Servicios = await prisma.Servicio.findMany({
			skip,
			take: limite,
			select:{
				Id:true,
				Nombre:true,
				Costo:true,
			},
			where: {
				Activo: show === 'active' ? true : false,

			}
		});				
		const total = await prisma.Servicio.count();
		res.json({
			total,
			Servicios,
		});
	} catch (error) {
		console.log(error);
		res.status(400).json({
			error
		});
	}
}
const serviciosGetWeb = async (req = request, res = response) => {
	const { page, limit } = req.query;
	const { Id = '' } = req.query
	let { show = 'active' } = req.query
	show === '' ? show = 'active' : null 
    if( show !== 'disabled'){
		show = 'active'
    }
	try {
		if(Id !== ''){
			const Servicio = await prisma.Servicio.findUnique({
				where: {
					Id:Id 
				},
			});
			const PathsArray = await prisma.ImgPaths.findMany({
				where: { ServicioId : Servicio.Id },
			});
			const ImgId = PathsArray.map((p) => {
				return p.Id;
			});
			Servicio.ImgIds = ImgId;
			
			if(!Servicio) {
				return res.status(400).json({msg: 'No existe ese Servicio'})
			}
			return res.json(Servicio)
		}
		const { skip, limite } = await evaluarPagina(page, limit);
		const Servicios = await prisma.Servicio.findMany({
			skip,
			take: limite,
			where: {
				Activo: show === 'active' ? true : false,
			}
		});		
		for (const Servicio of Servicios) {
			const ServicioId = Servicio.Id;
			const PathsArray = await prisma.ImgPaths.findMany({
				where: { ServicioId },
			});
			const Id = PathsArray.map( (p) => {
				return p.Id;
			});
			Servicio.ImgIds = Id;		
			if(PathsArray.length >= 0){
				Servicios.ImgIds = '';				
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
			error
		});
	}
};
const serviciosPost = async (req = request, res = response) => {
	let { Nombre, Prioritario, Descripcion, FechaPago, Precio } = req.body;
	Prioritario = Boolean(Prioritario)
	Precio = Number(Precio);
	const Id = uuidv4()
	const Servicio = await prisma.Servicio.create({
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
		msg: "ServiciosPost - controlador",
		Servicio,
	});
};
const serviciosPut = async (req = request, res = response) => {
	const { Id } = req.params;	
	const data = req.body;
	console.log(data);
	data.Costo = Number(data.Costo)
	data.Cancelable = Boolean(data.Cancelable)


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
};
