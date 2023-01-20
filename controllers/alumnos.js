const { response, request } = require('express')

const bcryptjs = require('bcryptjs')
const  { PrismaClient, prisma } = require ("@prisma/client");
const { evaluarPagina } = require('../helpers/paginacion');

const alumnosGet = async(req = request, res = response) => { 
    const { page, limit } = req.query
    const { skip, pagina, limite } = evaluarPagina(page, limit)
    const prisma = new PrismaClient();    
    const total = await prisma.alumno.count()
    const allUsers = await prisma.alumno.findMany({
        skip,
        take: limite
    })
    
    res.json({       
        total,
        skip,
        pagina,
        limite,
        allUsers,
    })
}
const alumnosPut = async(req = request, res = response) => {
  /*   const { id } = req.params
    const prisma = new PrismaClient()
    const user = await prisma.alumno.findUnique({where : { Id:Number(id) }})
    const { password } = req.body
    let uwu = false
    if(bcryptjs.compareSync(password.toString(), user.alumnoId)){
        uwu = true
    }
    user 
    ? res.json({
            msg: 'put alumno',
            user ,
            uwu
        }) 
    : res.status(404).json({
        msg: `no se encontro el usuario con el id: ${id}`
    }) */
    const prisma = new PrismaClient()
    //TODO: FILTRAR ALUMNOS POR ID DE TUROR
    const alumnos =  prisma.alumno.findMany({where: {TutorId: Id}})
}
const alumnosPost = async(req, res = response) => {
    const { 
        Nombres,   
        ApellidoMaterno,
        ApellidoPaterno,
        Grado,
        Grupo,
        Genero,
        TutorId,
    } =  req.body
    const prisma = new PrismaClient()
    const tutor = await prisma.tutor.findUnique({where: {Id: TutorId}})
    if ( !tutor ){
        return res.status(400).json({
            msg: `no existe el tutor con el id: ${TutorId}`
        })
    }
    const alumno = await prisma.alumno.create({
        data: {            
            Nombres,
            ApellidoMaterno,
            ApellidoPaterno,
            Grado,
            Grupo,
            Genero,
            TutorId,
        },
      }); 
    res.json({
        msg: 'post API alumnos - controlador',
        alumno
    })    
}
module.exports = {
   alumnosGet,
   alumnosPost,
   alumnosPut,
}





