const { response, request } = require('express')
const  { PrismaClient } = require ("@prisma/client");
const { evaluarPagina } = require('../helpers/paginacion');
const prisma = new PrismaClient()

const serviciosGet = async(req = request, res = response) => { 
    const { page = 1, limit } = req.query
    try {
        const { skip, pagina , limite } = await evaluarPagina(page, limit)
        let servicios = await prisma.servicio.findMany({
            skip,
            take: limite
        })
        for (let i = 0; i < servicios.length; i++) {
            const ServicioId = servicios[i].Id        
            const PathsArray = await prisma.imgPaths.findMany( { where : {ServicioId} } )
            const Id = PathsArray.map(p => {return p.Id})
            servicios[i].ImgIds = Id
        }

        res.json({
            pagina,
            skip,
            limite,
            servicios,            
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            error
        })
    }
}

const serviciosPost = async(req = request, res = response) => {
    let { 
        Nombre,
        Prioritario = '',
        Descripcion,
        FechaPago,
        Precio,
    } = req.body 
    Prioritario.toLowerCase()
    console.log(Prioritario);
    if(Prioritario == 'false' || Prioritario ==  0){ Prioritario = false} else { Prioritario = true }

    console.log(Prioritario);
    Precio = Number(Precio)
    
    const servicio = await prisma.servicio.create( {
        data:{
            Nombre,
            Prioritario,
            Descripcion,
            FechaPago,
            Precio,
        }
    })
    res.json({
        msg: 'serviciosPost - controlador',
        servicio
    })    
}
const serviciosPut = async (req = request, res = response) => {    
    return res.json({
        msg:`put ${req.params.Id}`
    })
}

module.exports = {
    serviciosGet,
    serviciosPost,
    serviciosPut,

}
