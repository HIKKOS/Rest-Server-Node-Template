const { request, response } = require("express");
const { PrismaClient } = require("@prisma/client");
const {
	calcularFechaExpiracion,
	getDiasRestantes,
} = require("../helpers/calcular-fecha-expiracion");
const { createOrder } = require("./paypal-api");
const prisma = new PrismaClient();
const renovarServicio = async (req = request, res = response) => {
	//!!Agregar cobro por paypal
	const { ServicioId, AlumnoId } = req.params;
	const { VecesContratado = 1 } = req.body;
	const servicio = await prisma.servicio.findUnique({
		where: {
			Id: ServicioId,
		},
		select: {
			Nombre: true,
			FrecuenciaDePago: true,
			Descripcion: true,
			Costo: true,
		},
	});
	let servicioAlumno = await prisma.serviciosDelAlumno.findUnique({
		where: {
			AlumnoId_ServicioId: {
				ServicioId,
				AlumnoId,
			},
		},
		select: {
			FechaExpiracion: true,
			FechaContrato: true,
		},
	});
	const { FechaExpiracion: nuevaFechaExpiracion } = calcularFechaExpiracion({
		VecesContratado,
		frecuencia: servicio.FrecuenciaDePago,
		initialDate: servicioAlumno.FechaExpiracion,
	});

	const purchase_units = [
		{
			custom_id: AlumnoId,
			reference_id: ServicioId,
			items: [
				{
					alumnoId: AlumnoId,
					name: servicio.Nombre,
					description: servicio.Descripcion,
					unit_amount: { currency_code: "MXN", value: servicio.Costo },
					quantity: VecesContratado,
				},
			],
			amount: {
				currency_code: "MXN",
				value: servicio.Costo * VecesContratado,
				breakdown: {
					item_total: {
						currency_code: "MXN",
						value: servicio.Costo * VecesContratado,
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
			servicioAlumno.FechaExpiracion,
			2,
		);
		return res.status(200).json({
			aprove: links[1].href,
		});
	} catch (error) {
		return res.status(500).json({
			msg: "algo salio mal",
		});
	}

	/* servicioAlumno = await prisma.serviciosDelAlumno.update({
		where: {
			AlumnoId_ServicioId: {
				ServicioId,
				AlumnoId,
			},
		},
		data: {
			FechaExpiracion: nuevaFechaExpiracion,
		},
	}); 

	return res.json({
		servicioAlumno,
		frec: servicio.FrecuenciaDePago,
		VecesContratado,
		fechaExp: nuevaFechaExpiracion,
		diasRestantes,
	});*/
};
module.exports = {
	renovarServicio,
};
