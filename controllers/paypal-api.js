const { request, response } = require("express");
const fs = require("fs");
const ejs = require("ejs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { PrismaClient } = require("@prisma/client");
const { getCorrectDateTime } = require("../helpers/getCorrectDateTime");
const {
	calcularFechaExpiracion,
} = require("../helpers/calcular-fecha-expiracion");
const { notificarPagoExitoso } = require("../helpers/notificacionPagoExitoso");
let purchaseDetails = {};
const prisma = new PrismaClient();

const apiUri = process.env.PAYPAL_API;
const host = process.env.HOST;
const username = process.env.PAYPAL_CLIENT_ID;
const password = process.env.PAYPAL_CLIENT_SECRET;

const getToken = async () => {
	const params = new URLSearchParams();
	params.append("grant_type", "client_credentials");
	const {
		data: { access_token },
	} = await axios.post(`${apiUri}/v1/oauth2/token`, params, {
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		auth: {
			username,
			password,
		},
	});
	return access_token;
};

const axios = require("axios");
const path = require("path");
const createOrder = async (
	req,
	res,
	purchase_units,
	nuevaFechaExpiracion,
	transactionCode = 1,
) => {
	try {
		const tokenTutor = req.header("x-token");
		const { Id: TutorId } = jwt.verify(
			tokenTutor,
			process.env.SECRETORPRIVATEKEY,
		);
		const { ServicioId, AlumnoId } = req.params;
		const { VecesContratado = 1, Horario } = req.body;
		const order = {
			intent: "CAPTURE",
			purchase_units,
			application_context: {
				brand_name: "payschool",
				locale: "es-MX",
				user_action: "PAY_NOW",
				landing_page: "LOGIN",
				return_url:
					transactionCode === 1
						? `${host}/api/test-paypal/capture-order`
						: `${host}/api/test-paypal/capture-order-renovar`,
				cancel_url: `${host}/api/test-paypal/cancel-order`,
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
		purchaseDetails.IdServicio = ServicioId;
		purchaseDetails.IdAlumno = AlumnoId;
		purchaseDetails.TutorId = TutorId;
		purchaseDetails.nuevaFechaExpiracion = nuevaFechaExpiracion;
		console.log("details: ", purchaseDetails);
		return links;
	} catch (error) {
		console.log(error);
		return res.status(500).json("msg: algo salio mal (paypal controller)");
	}
};
const cancelOrder = (req = request, res = response) => {
	purchaseDetails = {};
	res.status(200).json({ msg: "Cancelado" });
};
const captureOrderRenovar = async (req = request, res = response) => {
	console.log("renovando");
	const { token } = req.query;
	const bearerToken = await getToken();
	const fechaActual = getCorrectDateTime();
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
	if (resp.status === 201) {
		const { VecesContratado, Horario, IdServicio, IdAlumno, TutorId } =
			purchaseDetails;
		console.log("paying: ", purchaseDetails);
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

		const { FechaExpiracion, diasRestantes } = calcularFechaExpiracion({
			VecesContratado,
			frecuencia: servicio.FrecuenciaDePago,
			initialDate: purchaseDetails.nuevaFechaExpiracion,
		});
		const [servicioAlumno, pago] = await prisma.$transaction([
			prisma.serviciosDelAlumno.update({
				where: {
					AlumnoId_ServicioId: {
						AlumnoId: IdAlumno,
						ServicioId: IdServicio,
					},
				},
				data: {
					FechaExpiracion,
				},
			}),
			prisma.pago.create({
				data: {
					AlumnoId: IdAlumno,
					Monto: servicio.Costo * VecesContratado,
					ServicioId: IdServicio,
					TutorId,
				},
			}),
		]);
		fs.readFile(
			"./templates/pagoExitoso.ejs",
			{ encoding: "utf-8" },
			(err, data) => {
				if (err) {
					console.log(err);
					return res
						.status(500)
						.send("Ocurrió un error al procesar la solicitud.");
				}
				const html = ejs.render(data, {
					fechaHoraPago: fechaActual.toLocaleDateString(),
					cantidadPagada: servicio.Costo * VecesContratado,
					idTransaccion: pago.Folio,
				});
				return res.send(html);
			},
		);
	} else {
		return res.status(500).json({ msg: "algo salio mal" });
	}
};

const captureOrder = async (req = request, res = response) => {
	const { token } = req.query;
	const bearerToken = await getToken();
	const fechaActual = getCorrectDateTime();
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
	if (resp.status === 201) {
		const { VecesContratado, Horario, IdServicio, IdAlumno, TutorId } =
			purchaseDetails;
		console.log("paying: ", purchaseDetails);
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

		const { FechaExpiracion, diasRestantes } = calcularFechaExpiracion({
			VecesContratado,
			frecuencia: servicio.FrecuenciaDePago,
			initialDate: fechaActual,
		});
		console.log("fecha expiracion: ", FechaExpiracion);
		console.log("fecha contrato: ", fechaActual);
		for (const date of Horario) {
			await prisma.horarioServicioAlumno.create({
				data: {
					Id: uuidv4(),
					AlumnoId: IdAlumno,
					ServicioId: IdServicio,
					Dia: date.Dia.toUpperCase(),
					Inicio: date.Inicio,
					Fin: date.Fin,
				},
			});
		}
		const [servicioAlumno, pago] = await prisma.$transaction([
			prisma.serviciosDelAlumno.create({
				data: {
					FechaContrato: fechaActual,
					FechaExpiracion,
					AlumnoId: IdAlumno,
					ServicioId: IdServicio,
				},
			}),
			prisma.pago.create({
				data: {
					AlumnoId: IdAlumno,
					Monto: servicio.Costo * VecesContratado,
					ServicioId: IdServicio,
					TutorId,
				},
			}),
		]);
		fs.readFile(
			"./templates/pagoExitoso.ejs",
			{ encoding: "utf-8" },
			(err, data) => {
				if (err) {
					console.log(err);
					return res
						.status(500)
						.send("Ocurrió un error al procesar la solicitud.");
				}
				const html = ejs.render(data, {
					fechaHoraPago: fechaActual.toLocaleString(),
					cantidadPagada: servicio.Costo * VecesContratado,
					idTransaccion: pago.Folio,
				});
				return res.send(html);
			},
		);
	} else {
		return res.status(500).json({ msg: "algo salio mal" });
	}
};

module.exports = {
	createOrder,
	cancelOrder,
	captureOrder,
	captureOrderRenovar,
};
