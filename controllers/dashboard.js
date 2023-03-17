const { response, request } = require("express");
const { PrismaClient } = require("@prisma/client");
const { contarRepeticiones } = require("../helpers/contarElementos");
const prisma = new PrismaClient();
const getCantidadServicos = async (req = request, res = response) => {
	const { from, to } = req.params;
	const cantServicios = await prisma.pago.findMany({
		where: {
			FechaPago: {
				gte: new Date(from),
				lt: new Date(to),
			},
		},
		select: {
			Servicio: {
				select: { Nombre: true },
			},
			FechaPago: true,
		},
	});
    const cant = cantServicios.map( s => ({
        Nombre: s.Servicio.Nombre,
    })).flatMap( s => Object.values(s) )
    const dataChart = contarRepeticiones(cant)
    dataChart
	return res.json(dataChart);
};
const getIngresos = async (req = request, res = response) => {
	const { from, to } = req.params;
	const ingresos = await prisma.pago.findMany({
		where: {
			FechaPago: {
				gte: new Date(from),
				lt: new Date(to),
			},
		},
		select: {
			Servicio: true,
			FechaPago: true,
			Monto: true,
		},
	});
	if (new Date(to) < new Date(from)) {
		return res.status(400).json({
			msg: "la fecha incial debe ser menor que final",
			inicio: from,
			final: to,
		});
	}

	if (ingresos.length === 0) {
		return res.json({
			msg: "sin registros para el rago de fechas: ",
			de: from,
			hasta: to,
		});
	}
	const total = ingresos
		.map((i) => i.Monto)
		.reduce((acum, actual) => acum + actual);
	return res.json({ total: Number(total.toFixed(2)) });
};
module.exports = {
	getIngresos,
	getCantidadServicos,
};
