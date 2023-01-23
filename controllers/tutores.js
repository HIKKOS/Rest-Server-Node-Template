const { response, request } = require('express')

const bcryptjs = require('bcryptjs')
const  { PrismaClient } = require ("@prisma/client");
const { evaluarPagina } = require('../helpers/paginacion');
const prisma = new PrismaClient()

const tutoresGet = async(req = request, res = response) => { 
    
    const { page, limit } = req.query
    const { skip, pagina, limite } = evaluarPagina(page, limit)
    const total = await prisma.tutor.count()    
    const allUsers = await prisma.tutor.findMany({
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
const tutoresGetById = async(req = request, res = response) => { 
    const id = req.params.id    
    const user = await prisma.tutor.findUnique( {where: {Id:Number(id)}} )
    if( !user ){
        return res.status(404).json({
            msg: `no existe un tutor con el id ${id}`
        })
    }
    
    res.json({    
        id,   
        user
    })
}
const tutoresPut = async(req = request, res = response) => {
    const { id } = req.params
    
    const user = await prisma.tutor.findUnique({where : { Id:Number(id) }})
    const { password } = req.body
    let uwu = false
    if(bcryptjs.compareSync(password.toString(), user.PasswordTutor)){
        uwu = true
    }
    user 
    ? res.json({
            msg: 'put tutor',
            user ,
            uwu
        }) 
    : res.status(404).json({
        msg: `no se encontro el usuario con el id: ${id}`
    })

}
const tutoresPost = async(req, res = response) => {    
    const { Nombres,   
        ApellidoMaterno,
        ApellidoPaterno,
        Correo         ,
        Telefono       ,
        RFC            ,
        PasswordTutor  ,
        Direccion       } =  req.body
    const existe = await prisma.tutor.findUnique({where: { Correo }})
    if (existe){
        return res.status(400).json({msg: `Ya existe el correo: ${Correo}`})
    }
    const salt = bcryptjs.genSaltSync()  
    const tutor = await prisma.tutor.create({
        data: {            
            Nombres        ,
            ApellidoMaterno,
            ApellidoPaterno,
            Correo         ,
            Telefono       ,
            RFC            ,
            PasswordTutor  :bcryptjs.hashSync(PasswordTutor, salt),
            Direccion      ,
        },
      }); 
    res.json({
        tutor
    })    
}
module.exports = {
   tutoresGet,
   tutoresPost,
   tutoresPut,
   tutoresGetById
}