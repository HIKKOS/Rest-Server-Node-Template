const { response, request } = require("express");
const { v4: uuidv4 } = require("uuid");
const { PrismaClient } = require("@prisma/client");
const { evaluarPagina } = require("../helpers/paginacion");
const jwt = require("jsonwebtoken");
const {
	calcularFechaExpiracion,
} = require("../helpers/calcular-fecha-expiracion");

const prisma = new PrismaClient();
const contratarServicio = async (req = request, res = response) => {
	const token = req.header("x-token");
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
			
			FechaExpiracion,
			AlumnoId: IdAlumno,
			ServicioId: IdServicio,
		},
	});  

	return res.json({
		FechaExpiracion,
		diasRestantes,
		msg: `El alumno ${alumno.PrimerNombre} adquirio: ${Servicio.Nombre}`,
	});
};

module.exports = {
	contratarServicio,
};
