const { response, request } = require("express");
const { v4: uuidv4 } = require("uuid");
const { PrismaClient } = require("@prisma/client");
const { evaluarPagina } = require("../helpers/paginacion");
const { createOrder } = require("../controllers/paypal-api");

const jwt = require("jsonwebtoken");
const {
	calcularFechaExpiracion,
} = require("../helpers/calcular-fecha-expiracion");

const prisma = new PrismaClient();
const contratarServicio = async (req = request, res = response) => {
	const { IdServicio, IdAlumno } = req.params;
	const { VecesContratado = 1, Horario } = req.body;
	const Servicio = await prisma.servicio.findUnique({
		where: {
			Id: IdServicio,
		},
	});
	const alumno = await prisma.alumno.findUnique({
		where: {
			Id: IdAlumno,
		},
	});
	const { FechaExpiracion, diasRestantes } = calcularFechaExpiracion(
		VecesContratado,
		Servicio.FrecuenciaDePago,
	);
	const purchase_units = [
		{
			custom_id: alumno.Id,
			reference_id: IdServicio,
			items: [
				{   
					alumnoId: alumno.Id,
					name: Servicio.Nombre,
					description: Servicio.Descripcion,
					unit_amount: { currency_code: "MXN", value: Servicio.Costo },
					quantity: VecesContratado,
				},
			],
			amount: {
				currency_code: "MXN",
				value: Servicio.Costo * VecesContratado,
				breakdown: {
					item_total: {
						currency_code: "MXN",
						value: Servicio.Costo * VecesContratado,
					}
				},
			}
		}
	];
	try {
		const links = await createOrder(req, res, purchase_units);
		return res.status(200).json({
			aprove: links[1].href,
		});
	} catch (error) {
		return res.status(500).json({
			msg: "algo salio mal",
		});
	}


};

module.exports = {
	contratarServicio,
};
