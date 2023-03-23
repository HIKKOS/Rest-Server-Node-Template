const { response, request } = require("express");
const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const { evaluarPagina } = require("../helpers/paginacion");
const prisma = new PrismaClient();
const getPagosById = async (req = request, res = response) => {
	const { TutorId = "" } = req.params;
	const Tutor = await prisma.tutor.findUnique({ where: { Id: TutorId } });
	if (!Tutor) {
		return res.status(400).json(`no existe el tutor con id: ${TutorId}`);
	}
	const pagos = await prisma.pago.findMany({ where: { TutorId } });
	const pagosFormat = [];
	for (const pago of pagos) {
		const Servicio = await prisma.servicio.findUnique({
			where: { Id: pago.ServicioId },
			select: { Nombre: true },
		});
		const Tutor = await prisma.tutor.findUnique({
			where: { Id: pago.TutorId },
			select: { Nombres: true, ApellidoPaterno: true, ApellidoMaterno: true },
		});
		const Alumno = await prisma.alumno.findUnique({
			where: { Id: pago.AlumnoId },
			select: { Nombres: true, ApellidoPaterno: true, ApellidoMaterno: true },
		});
		pagosFormat.push({
			Folio: pago.Folio,
			FechaPago: pago.FechaPago,
			Tutor: `${Tutor.Nombres} ${Tutor.ApellidoPaterno} ${Tutor.ApellidoMaterno}`,
			Alumno: `${Alumno.Nombres} ${Alumno.ApellidoPaterno} ${Alumno.ApellidoMaterno}`,
			Servicio: `${Servicio.Nombre}`,
			Monto: pago.Precio,
			Facturar: pago.Facturar,
		});
	}
	return res.json(pagosFormat);
};
const getServiciosPendientesPor = async () => {
	const token = req.header("x-token");
	const { Id } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
};
const getAllPagos = async (req = request, res = response) => {
	const { page, limit } = req.query;
	const { skip, limite } = await evaluarPagina(page, limit);
	const total = await prisma.pago.count();
	const pagos = await prisma.pago.findMany({
		skip,
		take: limite,
		select: {
			Servicio: {
				select: {
					Nombre: true,
				},
			},
			Monto: true,
			Tutor: {
				select: {
					PrimerNombre: true,
					ApellidoPaterno: true,
				},
			},

			Facturar: true,
			AlumnoId: true,
			Folio: true,
			FechaPago: true,
		},
	});

	const totalPagos = pagos.map(  (pago) => ({
		folio: pago.Folio,
		fechaPago: pago.FechaPago,
		servicio: pago.Servicio.Nombre,
		monto: pago.Monto,
		facturado: pago.Facturar,
		Tutor: `${pago.Tutor.PrimerNombre} ${pago.Tutor.ApellidoPaterno}`,
		AlumnoId: pago.AlumnoId,
		
	}));
	for (const pago  of totalPagos) {
		const alumno = await prisma.alumno.findUnique({
			where: {
				Id: pago.AlumnoId,
			},
			select: {
				PrimerNombre: true,
				ApellidoPaterno: true,
			},
		});
		pago.alumno = `${alumno.PrimerNombre} ${alumno.ApellidoPaterno}`;
		pago.AlumnoId = undefined;
	}
	return res.json({total, pagos: totalPagos});
};

const getPagos = async (req = request, res = response) => {
	const token = req.header("x-token");
	const { Id } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
	const pagos = await prisma.pago.findMany({
		where: {
			TutorId: Id,
		},
		select: {
			Servicio: {
				select: {
					Nombre: true,
				},
			},
			Monto: true,
			Facturar: true,
			AlumnoId: true,
			Folio: true,
			FechaPago: true,
		},
	});
	const totalPagos = [];
	for (const pago of pagos) {
		const alumno = await prisma.alumno.findUnique({
			where: {
				Id: pago.AlumnoId,
			},
			select: {
				PrimerNombre: true,
				SegundoNombre: true,
			},
		});
		const p = {
			folio: pago.Folio,
			fechaPago: pago.FechaPago,
			servicio: pago.Servicio.Nombre,
			monto: pago.Monto,
			facturado: pago.Facturar,
			alumno: `${alumno.PrimerNombre} ${alumno.SegundoNombre}`,
		};

		totalPagos.push(p);
	}
	return res.json(totalPagos);
};
const busquedaPagos = async (req = request, res = response) => {
	const { Servicio: query = "" } = req.query;
	const token = req.header("x-token");
	const { Id } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
	const { page, limit } = req.query;
	try {
		const { skip, limite } = await evaluarPagina(page, limit);
		const pagos = await prisma.pago.findMany({
			where: {
				TutorId: Id,
				Servicio: {
					Nombre: {
						startsWith: query, 
					}
				}
			},
			skip,
			take: limite,
			select: {
				Servicio: {
					select: {
						Id: true,
						Nombre: true,
						ImgPaths: {
							select: {
								Id: true
							}
						}
					}
				},
				Monto: true,
				Facturar: true,
				AlumnoId: true,
				Folio: true,
				FechaPago: true,
			}
		});
		const allPagos = []
		for (const pago of pagos) {
			const alumno = await prisma.alumno.findUnique({
				where: {
					Id: pago.AlumnoId
				}, select: {
					PrimerNombre: true,
					SegundoNombre: true,
				}
			})
			const imgPaths = pago.Servicio.ImgPaths.map((p) => {
				const [path] = Object.values(p);
				return path;
			  });
	
			const p = {
				folio: pago.Folio,
				fechaPago: pago.FechaPago,
				servicio: pago.Servicio.Nombre,
				servicioId: pago.Servicio.Id,
				monto: pago.Monto,
				facturado: pago.Facturar,
				alumno: `${alumno.PrimerNombre} ${alumno.SegundoNombre}`,
				imgPaths: imgPaths
			}

			allPagos.push(p)
		}
		return res.json(allPagos);
	} catch (err) {
		console.log(err);
	}
};

const postPagos = async (req = request, res = response) => {
	const { TutorId, ServicioId, AlumnoId, Facturar = false } = req.body;
	const Servicio = await prisma.servicio.findUnique({
		where: { Id: ServicioId },
	});
	const Tutor = await prisma.tutor.findUnique({ where: { Id: TutorId } });
	const Alumno = await prisma.alumno.findUnique({ where: { Id: AlumnoId } });
	if (!Tutor) {
		return res
			.status(400)
			.json({ msg: `no existe un Tutor con id: ${TutorId}` });
	}
	if (!Alumno) {
		return res
			.status(400)
			.json({ msg: `no existe un Alumno con id: ${AlumnoId}` });
	}
	if (!Servicio) {
		return res
			.status(400)
			.json({ msg: `no existe un Servicio con id: ${ServicioId}` });
	}
	const data = {
		ServicioId,
		TutorId,
		AlumnoId,
		Monto: Servicio.Precio,
		Facturar,
	};
	const pago = await prisma.pago.create({
		data,
	});

	return res.json({
		pago,
	});
};
module.exports = {
	getPagos,
	postPagos,
	getPagosById,
	getAllPagos,
	busquedaPagos,
};
//9UnZsYebHxWp2sc