const { response, request } = require("express");
const { v4: uuidv4 } = require('uuid');
const { PrismaClient } = require("@prisma/client");
const { evaluarPagina } = require("../helpers/paginacion");
const { reduceName } = require("../helpers/reduceName");
const prisma = new PrismaClient();
const alumnosGet = async (req = request, res = response) => {
	
	const { AlumnoId = '' } = req.query
	if( AlumnoId !== ''){
		const Alumno = await prisma.alumno.findUnique({
			where: {
				Id: AlumnoId
			}
		})
		if( !Alumno ) {
			return res.status(400).json(`no existe el alumno con id: ${Id}`)
		}
	}
	
    let { show = 'active' } = req.query
    if( show !== 'active'){
        show = 'disabled'
    }
	const { page, limit} = req.query;
	const { skip, limite } = await evaluarPagina(page, limit);

	const total = await prisma.alumno.count()
	const Alumnos = await prisma.alumno.findMany({
		skip,
		take: limite,       
        where: {
		    Activo: show === 'active' ? true : false,
		}
         
	});
    const data = Alumnos.map(a => {
        const {CreatedAt, Activo, ...resto} = a
        return resto
    })
	return res.json({
		total,
		Alumnos: data
	});
};
const alumnosPut = async (req = request, res = response) => {
	let alumno = {};
    const { Id } = req.params
	const {
		TutorId,
		Nombres,
		ApellidoMaterno,
		ApellidoPaterno,
		Grado,
		Grupo,
		Genero,
	} = req.body;
	console.log(Genero);
	if ( !TutorId ) {
		alumno = {
			Nombres,
			ApellidoMaterno,
			ApellidoPaterno,
			Grado: Number(Grado),
			Grupo,
			Genero: Genero === 0 ? 0 : 1,
		};
	} else {
        const tutor = await prisma.tutor.findUnique({ where: { Id:(TutorId) } })
        if(!tutor){
            return res.status(400).json({ msg: `No existe el tutor con id ${TutorId}`})
        }
        alumno = {
            TutorId:TutorId,
			Nombres,
			ApellidoMaterno,
			ApellidoPaterno,
			Grado: Number(Grado),
			Grupo,
			Genero: Genero === 0 ? 0 : 1,
		};
    }
    const resp = await prisma.alumno.update({ where: { Id:(Id) }, data: alumno })
    return res.json({
        resp
    })
};
const alumnosPost = async (req = request, res = response) => {
	const { Nombres, ApellidoMaterno, ApellidoPaterno, Grado, Grupo, Genero } =
		req.body;
	const Id = uuidv4()
    //! TODO: FUNCION PARA VALIDAR NOMBRES SIN ESPACIOS
	const alumno = await prisma.alumno.create({
		data: {
			Id,
			Nombres,
			ApellidoPaterno,
			ApellidoMaterno,
			Grado: Number(Grado),
			Grupo,
			Genero: Genero === 0 ? 0 : '1',
		},
	});
	return res.json({
		alumno,
	});
};
const alumnosDelete = async (req = request, res = response) => {
	const { Id } = req.params;
	const alumno = await prisma.alumno.findUnique({ where: { Id: Number(Id) } });
	if (!alumno) {
		return res.status(400).json({
			msg: `no existe el Id ${Id}`,
		});
	}
	await prisma.alumno.update({
		where: { Id: Number(Id) },
		data: { Activo: false },
	});
	return res.json({
		alumno,
	});
};

module.exports = {
	alumnosGet,
	alumnosPost,
	alumnosPut,
	alumnosDelete,
};
