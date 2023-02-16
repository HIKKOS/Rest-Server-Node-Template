const { response, request } = require("express");
const { v4: uuidv4 } = require('uuid');
const bcryptjs = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const { evaluarPagina } = require("../helpers/paginacion");
const jwt = require('jsonwebtoken')
const prisma = new PrismaClient();

const tutoresGet = async (req = request, res = response) => {
	const { Id = '' } = req.query
	if(Id !== ''){
		const tutor = await prisma.tutor.findUnique({
			where: {
				Id
			}
		})
		if( !tutor ) {
			return res.status(400).json(`no existe el tutor con id: ${Id}`) 	
		}
		return res.json({tutor})
	}
	const { page, limit } = req.query;
	try {
		const { skip, limite } = await evaluarPagina(page, limit);	
		const total = await prisma.tutor.count({where: {Activo:true}});
		const allUsers = await prisma.tutor.findMany({
			skip,
			take: limite,
			where:{
				Activo:true
			}
		});
		const tutores = allUsers.map((t) => {
			const { PasswordTutor, CreatedAt, MetodoPago, Activo, ...resto } = t;
			return resto;
		});
	
		res.json({
			total:total,
			Tutores: tutores,
		});
	} catch (error) {
		return res.status(400).json({
			error,
		});
	}
};
const tutoresGetById = async (req = request, res = response) => {
	const token = req.header('x-token')
	const { Id } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
	const user = await prisma.tutor.findUnique({ where: { Id } });
	if (!user) {
		return res.status(404).json({
			msg: `no existe un tutor con el id ${Id}`,
		});
	}
	const {CreatedAt, Activo, ...resto} = user 
	return res.json({
		Tutor: resto
	});
};
const tutoresPut = async (req = request, res = response) => {
	const { id } = req.params;
	const data  = req.body
	console.log(data);
 	const {PasswordTutor, ...resto} = data
	 const salt = bcryptjs.genSaltSync();
	const Tutor = await prisma.tutor.findUnique({ where: { Id: Number(id) } });
	if( !Tutor ){
		return res.status(400).json({
				msg: `no se encontro el usuario con el id: ${id}`,
	});}
	!PasswordTutor ?
	await prisma.tutor.update({ 
		where: {Id:Number(id)
		},
		data:resto
		
	 })
	 
	:
	bcryptjs.hashSync(PasswordTutor, salt),
	await prisma.tutor.update({ 
		where: {Id:Number(id)
		},
		data: {
			PasswordTutor: PasswordTutor
		}
	 })
	
	
};
const tutoresPost = async (req, res = response) => {
	const {
		Nombres,
		ApellidoMaterno,
		ApellidoPaterno,
		Correo,
		Telefono,
		RFC,
		PasswordTutor,
		Direccion,
	} = req.body;
	
	const Id = uuidv4() 

	const pass = PasswordTutor.toString()
	const existe = await prisma.tutor.findUnique({ where: { Correo } });
	if (existe) {
		return res.status(400).json({ msg: `Ya existe el correo: ${Correo}` });
	}
	const salt = bcryptjs.genSaltSync();
	const tutor = await prisma.tutor.create({
		data: {
			Id,
			Nombres,
			ApellidoMaterno,
			ApellidoPaterno,
			Correo,
			Telefono,
			RFC,
			Foto: '',
			PasswordTutor: bcryptjs.hashSync(pass, salt),
			Direccion,
		},
	});
	res.json({
		tutor,
	});
};
const tutoresDelete = async(req = request, res = response) => {
	const {Id} = req.params;
	const tutor = await prisma.tutor.findUnique({ where: { Id:Number(Id) } });
	if ( !tutor ) {
		return res.status(404).json({ msg: `no existe el id: ${Id}` });
	}
	try {
		await prisma.tutor.update({ where: { Id:Number(Id) },data:{Activo:false} })			
		return res.json({
			msg:'elimidado correctamente'
		})
	} catch (error) {
		console.log(err);
	}
		
	

}
module.exports = {
	tutoresGet,
	tutoresGetById,
	tutoresDelete,
	tutoresPost,
	tutoresPut,
};
