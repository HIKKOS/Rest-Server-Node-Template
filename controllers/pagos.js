const { response, request } = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const getPagosById = async(req = request, res = response) => {
	const { TutorId } = req.params
	const pagos = await prisma.pago.findMany( {where: {TutorId } } );
	const pagosFormat = []
	for (const pago of pagos) {
		const Servicio = await prisma.servicio.findUnique( {where: { Id: pago.ServicioId }, select: { Nombre:true }})
		const Tutor = await prisma.Tutor.findUnique( {where: { Id: pago.TutorId }, select: { Nombres:true, ApellidoPaterno: true, ApellidoMaterno:true }})
		const Alumno = await prisma.Alumno.findUnique( {where: { Id: pago.AlumnoId }, select: { Nombres:true, ApellidoPaterno: true, ApellidoMaterno:true }})
		pagosFormat.push(
			{
				Folio: pago.Folio,
				FechaPago: pago.FechaPago, 
				Tutor: `${Tutor.Nombres} ${Tutor.ApellidoPaterno} ${Tutor.ApellidoMaterno}`,
				Alumno: `${Alumno.Nombres} ${Alumno.ApellidoPaterno} ${Alumno.ApellidoMaterno}`,
				Servicio: `${Servicio.Nombre}`,
				Monto: pago.Precio,
				Facturar: pago.Facturar
			}
		)
	}
	return res.json(pagosFormat);
}
const getPagos = async (req = request, res = response) => {
	const pagos = await prisma.pago.findMany();
	const pagosFormat = []
	for (const pago of pagos) {
		const Servicio = await prisma.servicio.findUnique( {where: { Id: pago.ServicioId }, select: { Nombre:true }})
		const Tutor = await prisma.Tutor.findUnique( {where: { Id: pago.TutorId }, select: { Nombres:true, ApellidoPaterno: true, ApellidoMaterno:true }})
		const Alumno = await prisma.Alumno.findUnique( {where: { Id: pago.AlumnoId }, select: { Nombres:true, ApellidoPaterno: true, ApellidoMaterno:true }})
		pagosFormat.push(
			{
				Folio: pago.Folio,
				FechaPago: pago.FechaPago.toUTCString(), 
				Tutor: `${Tutor.Nombres} ${Tutor.ApellidoPaterno} ${Tutor.ApellidoMaterno}`,
				Alumno: `${Alumno.Nombres} ${Alumno.ApellidoPaterno} ${Alumno.ApellidoMaterno}`,
				Servicio: `${Servicio.Nombre}`,
				Monto: pago.Precio,
				Facturar: pago.Facturar
			}
		)
	}
	return res.json(pagosFormat);
};
const postPagos = async (req = request, res = response) => {
	const { TutorId, ServicioId, AlumnoId, Facturar = false } = req.body;
	const Servicio = await prisma.servicio.findUnique({
		where: { Id: ServicioId },
	});
	const Tutor = await prisma.tutor.findUnique({ where: { Id: TutorId } });
	const Alumno = await prisma.alumno.findUnique({ where: { Id: AlumnoId } });
	if (!( Tutor )) {
        return res.status(400).json({msg: `no existe un Tutor con id: ${TutorId}`})
	}
	if (!( Alumno )) {
        return res.status(400).json({msg: `no existe un Alumno con id: ${AlumnoId}`})
	}
	if (!( Servicio )) {
        return res.status(400).json({msg: `no existe un Servicio con id: ${ServicioId}`})
	}
	const data = {
        ServicioId,      
        TutorId,    
        AlumnoId,
        Monto: Servicio.Precio,     
        Facturar
    };
	const pago = await prisma.pago.create({
		data
	})

	return res.json({
		pago
	});
};
module.exports = {
	getPagos,
	postPagos,
	getPagosById,

};
