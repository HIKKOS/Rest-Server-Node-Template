const path = require('path')
const fs = require('fs')
const { response, request } = require("express");

const bcryptjs = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const { evaluarPagina } = require("../helpers/paginacion");
const prisma = new PrismaClient();

const MostrarFoto = async (req = request, res = response ) => {
    const { TutorId } = req.query       
    console.log(TutorId);
    const tutor = await prisma.tutor.findUnique({ where: { Id: Number(TutorId) } })
    if( !tutor ){
        return res.status(400).json({
            msg:`No existe una imagen con id ${TutorId}`
        })
    }
	console.log(tutor);
    const pathImagen = path.join(__dirname,'../uploads/Tutores/',`${TutorId}/`,tutor.Foto)
    if( !fs.existsSync(pathImagen) ){
        const pathImagen = path.join(__dirname,'../assets/no-image.jpg')
        return res.sendFile(pathImagen)
    }
    return res.sendFile(pathImagen)      
    
}

const tutoresGet = async (req = request, res = response) => {
	const { page, limit } = req.query;
	try {
		const { skip, pagina, limite } = await evaluarPagina(page, limit);
		const total = await prisma.tutor.count();
		let allUsers = await prisma.tutor.findMany({
			skip,
			take: limite,
		});
		allUsers.map((u) => {
			{
				(u.PasswordTutor = undefined),
				(u.CreatedAt = undefined),
				(u.MetodoPago = undefined);
			}
		});
		res.json({
			total,
			skip,
			pagina,
			limite,
			allUsers,
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

	const user = await prisma.tutor.findUnique({ where: { Id: Number(id) } });
	const { password } = req.body;
	let uwu = false;
	if (bcryptjs.compareSync(password.toString(), user.PasswordTutor)) {
		uwu = true;
	}
	user
		? res.json({			
				user,
		  })
		: res.status(404).json({
				msg: `no se encontro el usuario con el id: ${id}`,
		  });
};
const tutoresPost = async (req, res = response) => {
	const data = req.body;
	const salt = bcryptjs.genSaltSync();
	data.PasswordTutor = bcryptjs.hashSync(data.Password, salt);
	data.Password = undefined;
	data.Telefono = data.Telefono.toString();
	const tutor = await prisma.tutor.create({
		data,
	});
	res.json({
		tutor,
	});
};
module.exports = {
	tutoresGet,
	tutoresPost,
	tutoresPut,
	tutoresGetById,
	MostrarFoto
};
