const { response, request } = require("express");

const bcryptjs = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const { evaluarPagina } = require("../helpers/paginacion");
const prisma = new PrismaClient();

const tutoresGet = async (req = request, res = response) => {
	const { page, limit } = req.query;

	try {
		const { skip, limite } = await evaluarPagina(page, limit);
		const total = await prisma.tutor.count();
		const allUsers = await prisma.tutor.findMany({
			skip,
			take: limite,
		});
		const tutores = allUsers.map((t) => {
			const { PasswordTutor, CreatedAt, MetodoPago, Activo, ...resto } = t;
			return resto;
		});
		res.json({
			Tutores: tutores,
		});
	} catch (error) {
		return res.status(400).json({
			error,
		});
	}
};
const tutoresGetById = async (req = request, res = response) => {
	const id = req.params.id;
	const user = await prisma.tutor.findUnique({ where: { Id: Number(id) } });
	if (!user) {
		return res.status(404).json({
			msg: `no existe un tutor con el id ${id}`,
		});
	}

	res.json({
		id,
		user,
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
	const existe = await prisma.tutor.findUnique({ where: { Correo } });
	if (existe) {
		return res.status(400).json({ msg: `Ya existe el correo: ${Correo}` });
	}
	const salt = bcryptjs.genSaltSync();
	const tutor = await prisma.tutor.create({
		data: {
			Nombres,
			ApellidoMaterno,
			ApellidoPaterno,
			Correo,
			Telefono,
			RFC,
			PasswordTutor: bcryptjs.hashSync(PasswordTutor, salt),
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
	tutoresDelete,
	tutoresPost,
	tutoresPut,
	tutoresGetById,
};
