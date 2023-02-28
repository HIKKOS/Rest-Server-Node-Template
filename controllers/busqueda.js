const { response, request } = require("express");

const { PrismaClient } = require("@prisma/client");
const { evaluarPagina } = require("../helpers/paginacion");
const { all } = require("../routes/auth");
const prisma = new PrismaClient();

const busquedaGet = async (req = request, res = response) => {
	const { Servicio = "" } = req.query;
	const { page, limit } = req.query;

	try {
		const { skip, limite } = await evaluarPagina(page, limit);
		let allServicios = await prisma.servicio.findMany({
			where: {
				Nombre: {
					startsWith: Servicio,
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
module.exports = {
	busquedaGet,
};
