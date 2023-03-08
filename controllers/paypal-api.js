const { request, response } = require("express");
const apiUri = process.env.PAYPAL_API;
const username = process.env.PAYPAL_CLIENT_ID;
const password = process.env.PAYPAL_CLIENT_SECRET;
const { v4: uuidv4 } = require("uuid");
const { PrismaClient } = require("@prisma/client");
const {
	calcularFechaExpiracion,
} = require("../helpers/calcular-fecha-expiracion");
const purchaseDetails = {};
const prisma = new PrismaClient();

const getToken = async () => {
	const params = new URLSearchParams();
	params.append("grant_type", "client_credentials");
	const {
		data: { access_token },
	} = await axios.post(
		"https://api-m.sandbox.paypal.com/v1/oauth2/token",
		params,
		{
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			auth: {
				username,
				password,
			},
		},
	);
	return access_token;
};

const axios = require("axios");
const createOrder = async (req = request, res = response, purchase_units) => {
	try {
		const { IdServicio, IdAlumno } = req.params;
		const { VecesContratado = 1, Horario } = req.body;
		const order = {
			intent: "CAPTURE",
			purchase_units,
			application_context: {
				brand_name: "payschool",
				locale: "es-MX",
				user_action: "PAY_NOW",
				landing_page: "LOGIN",
				return_url: "http://localhost:8080/api/test-paypal/capture-order",
				cancel_url: "http://localhost:8080/api/test-paypal/cancel-order",
			},
		};
		const token = await getToken();
		const resp = await axios.post(`${apiUri}/v2/checkout/orders`, order, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		});
		const links = resp.data.links;
		purchaseDetails.VecesContratado = VecesContratado;
		purchaseDetails.Horario = Horario;
		purchaseDetails.IdServicio = IdServicio;
		purchaseDetails.IdAlumno = IdAlumno;
		return links;
	} catch (error) {
		console.log(error);
		return res.status(500).json("msg: algo salio mal (paypal controller)");
	}
};
const cancelOrder = (req = request, res = response) => {
	res.status(200).json({ msg: "Cancelado" });
};
const captureOrder = async (req = request, res = response) => {
	const { token } = req.query;
	const bearerToken = await getToken();
	const resp = await axios.post(
		`${apiUri}/v2/checkout/orders/${token}/capture`,
		{},
		{
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${bearerToken}`,
			},
		},
	);
	console.log(resp.data);
	if (resp.status === 201) {
		const { VecesContratado, Horario, IdServicio, IdAlumno } = purchaseDetails;
		const alumno = await prisma.alumno.findUnique({
			where: {
				Id: IdAlumno,
			},
		});
		const servicio = await prisma.servicio.findUnique({
			where: {
				Id: IdServicio,
			},
		});
		const { FechaExpiracion, diasRestantes } = calcularFechaExpiracion(
			VecesContratado,
			servicio.FrecuenciaDePago,
		);
		for (const date of Horario) {
			console.log({date});
			 await prisma.horarioServicioAlumno.create({
				data:{
					Id: uuidv4(),
					AlumnoId: IdAlumno,
					ServicioId: IdServicio,
					Dia: date.Dia,
					HoraInicio: date.Inicio,
					HoraFin: date.Fin,
				}
			}); 
		}
		await prisma.serviciosDelAlumno.create({
			data: {
				Id: uuidv4(),
				FechaContrato: new Date(),
				FechaExpiracion,
				AlumnoId: IdAlumno,
				ServicioId: resp.data.purchase_units[0].reference_id,
			}
		});
		return res.json({
			FechaExpiracion,
			diasRestantes,
			msg: `El alumno ${alumno.PrimerNombre} adquirio: ${servicio.Nombre}`,
		});
	}
	return res.status(500).json({ msg: "algo salio mal" });
};

module.exports = {
	createOrder,
	cancelOrder,
	captureOrder,
};
//https://api.sandbox.paypal.com/v2/checkout/orders/5NK27136CM838273K/capture
