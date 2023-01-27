const { response, request } = require("express");

const { PrismaClient } = require("@prisma/client");
const { evaluarPagina } = require("../helpers/paginacion");
const prisma = new PrismaClient();

const busquedaGet = async (req = request, res = response) => {
	const { Servicio= '' } = req.query
	const { page, limit } = req.query;

	try {
		const { skip, limite } = await evaluarPagina(page, limit);		
		const allServicios = await prisma.servicio.findMany({
			where: {
				 Nombre: {
					startsWith: Servicio
				}				
			},
			skip,
			take: limite,
		});
		if(allServicios.length === 0){
			return res.json({msg: `no se econtro ningun resultado para ${Servicio}`})
		}
		res.json({
			allServicios,
		});
	} catch (error) {
		return res.status(400).json({
			error
		})
	}
};
	module.exports = {
	busquedaGet,
}
