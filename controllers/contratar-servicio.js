const { response, request } = require("express");
const { PrismaClient } = require("@prisma/client");
const { createOrder } = require("../controllers/paypal-api");
const { VerificarHorario } = require("../helpers/verificarHorario");
const { getCorrectDateTime } = require("../helpers/getCorrectDateTime");
const jwt = require("jsonwebtoken");
const {
	calcularFechaExpiracion,
} = require("../helpers/calcular-fecha-expiracion");

const prisma = new PrismaClient();
const contratarServicio = async (req = request, res = response) => {
	const { ServicioId: IdServicio, AlumnoId: IdAlumno } = req.params;
	const { VecesContratado = 1, Horario = [] } = req.body;
	const Servicio = await prisma.servicio.findUnique({
		where: {
			Id: IdServicio,
		},
		select: {
			Nombre: true,
			Descripcion: true,
			Costo: true,
			FrecuenciaDePago: true,
			HorarioServicio: {
				select: {
					Dia: true,
					Inicio: true,
					Fin: true,
				},
			},
		},
	});
	const alumno = await prisma.alumno.findUnique({
		where: {
			Id: IdAlumno,
		},
	});

	if (Servicio.HorarioServicio.length > 0) {
		if (!VerificarHorario(Servicio.HorarioServicio)) {
			return res.status(400).json({
				msg: "El horario no es valido",
			});
		}
	}
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
					},
				},
			},
		},
	];
	try {
		const links = await createOrder(
			req,
			res,
			purchase_units,
			getCorrectDateTime,
			1,
		);
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
