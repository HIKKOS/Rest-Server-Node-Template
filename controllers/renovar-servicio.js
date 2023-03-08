const { request, response } = require("express");
const { PrismaClient } = require("@prisma/client");
const { calcularFechaExpiracion, getDiasRestantes } = require("../helpers/calcular-fecha-expiracion");
const prisma = new PrismaClient();
const renovarServicio = async (req = request, res = response) => {
	const { IdServicio: ServicioId, IdAlumno: AlumnoId } = req.params;
	const { VecesContratado = 1, Horario } = req.body;
    const servicio = await prisma.servicio.findUnique({
        where:{
            Id: ServicioId
        },
        select:{
            FrecuenciaDePago: true
        }
    })
    let servicioAlumno = await prisma.serviciosDelAlumno.findUnique({
        where: {
            AlumnoId_ServicioId: {
                ServicioId,
				AlumnoId,
			},
		},
        select:{
            FechaExpiracion:true,
            FechaContrato:true
        }
	});
    const {FechaExpiracion:nuevaFechaExpiracion} = calcularFechaExpiracion({VecesContratado,frecuencia: servicio.FrecuenciaDePago, initialDate: servicioAlumno.FechaExpiracion })
    const diasRestantes = getDiasRestantes({initialDate:servicioAlumno.FechaContrato,lastDate:nuevaFechaExpiracion})
	servicioAlumno = await prisma.serviciosDelAlumno.update({
        where: {
            AlumnoId_ServicioId: {
                ServicioId,
				AlumnoId,
			},
		},
        data:{
            FechaExpiracion:nuevaFechaExpiracion,
        }
	});
   
	return res.json({
        servicioAlumno,
        frec: servicio.FrecuenciaDePago,
        VecesContratado,
        fechaExp : nuevaFechaExpiracion,
        diasRestantes

	});
};
module.exports = {
	renovarServicio,
};
