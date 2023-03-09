const { response, request } = require("express");
const { PrismaClient } = require("@prisma/client");
const jwt = require("jsonwebtoken");
const prisma = new PrismaClient();
const getPagosById = async(req = request, res = response) => {
	const { TutorId = '' } = req.params
	const Tutor = await prisma.tutor.findUnique( {where: { Id: TutorId }})
	if( !Tutor ) {
		return res.status(400).json(`no existe el tutor con id: ${TutorId}`)
	}
	const pagos = await prisma.pago.findMany( {where: {TutorId } } );
	const pagosFormat = []
	for (const pago of pagos) {
		const Servicio = await prisma.servicio.findUnique( {where: { Id: pago.ServicioId }, select: { Nombre:true }})
		const Tutor = await prisma.tutor.findUnique( {where: { Id: pago.TutorId }, select: { Nombres:true, ApellidoPaterno: true, ApellidoMaterno:true }})
		const Alumno = await prisma.alumno.findUnique( {where: { Id: pago.AlumnoId }, select: { Nombres:true, ApellidoPaterno: true, ApellidoMaterno:true }})
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
const getServiciosPendientesPor = async () =>{
	const token = req.header("x-token");
	const { Id } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
} 
const getPagos = async (req = request, res = response) => {
	const token = req.header("x-token");
	const { Id } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
	let pagos = await prisma.pago.findMany({
		where:{
			TutorId: Id
		},
		select:{
			Servicio: {
				select:{
					Nombre:true
				}
			},
			Monto:true,
			Facturar:true,
			AlumnoId:true,
			Folio:true,
			FechaPago:true,
		}
		
	});
	const totalPagos = []
	for (const pago of pagos) {
		const alumno = await prisma.alumno.findUnique({
			where:{
				Id: pago.AlumnoId
			}, select:{
				PrimerNombre:true,
				SegundoNombre: true,
			}
		})
		const p = {
			folio: pago.Folio,
			fechaPago: pago.FechaPago,
			servicio: pago.Servicio.Nombre,
			monto: pago.Monto,
			facturado:pago.Facturar, 
			alumno: `${alumno.PrimerNombre} ${alumno.SegundoNombre}` ,
		}
		
		totalPagos.push(p)
	}
	return res.json(totalPagos)
	
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
