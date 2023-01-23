const  path  = require('path')
const  fs  = require('fs')

const { response, request } = require("express")
const { uploadFile } = require("../helpers")
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const cargarArchivo = async (req = require, res = response) => {
    let Id = req.params.Id
    const servicio = await prisma.servicio.findUnique( { where: { Id:Number(Id) } } )
    if( !servicio ){
        return res.status(404).json({
            msg : `No existe un servicio con el id: ${Id}`
        })
    }
    try {
        const dir = await uploadFile(req.files, undefined)
        const archivo = await prisma.imgPaths.create({
            data : { 
                Path: dir,
                ServicioId: Number(Id)
            }
        })
        res.status(201).json({ 
            msg:`se subio la foto ${ archivo.Id } del servicio: ${servicio.Nombre} `
        })
    } catch (error) {
        console.log(error);
      res.status(400).json({error})
    }
}
const actualizarImagen = async( req = request, res = response ) => {
    const { Id, ServicioId } = req.query    
    
    const servicio = await prisma.servicio.findUnique( { where: {Id:Number(ServicioId)} } );
    if( !servicio ) {
        return res.status(404).json({
            msg:`El id serivicio con id: ${ServicioId} no existe`
        })
    }
    const imgPaths = await prisma.imgPaths.findMany({ where : { Id: Number(Id) } })
    console.log(imgPaths);
    if( imgPaths.length == 0 ){
        return res.status(400).json({
            msg: `no existe una imagen con id:${Id} relacionado con el serivicio: ${servicio.Nombre}`
        })
    }
/* 
    await prisma.imgPaths.updateMany({
        data:{
            Path:
        },
        where:{ Id: Number(Id)
        }
    }) */
    res.json({
        servicio,
        Id
    })
}
const MostrarImagen = async (req = request, res = response ) => {
    const { Id } = req.params        
    
    const img = await prisma.imgPaths.findUnique({ where: { Id: Number(Id) } })
    if( !img ){
        const pathImagen = path.join(__dirname,'../assets/no-image.jpg')
        return res.sendFile(pathImagen)
    }
    const pathImagen = path.join(__dirname,'../uploads/',img.Path)
    return res.sendFile(pathImagen)      
    
}
const deleteImagen = async (req = request, res = response) => {
    
    const { Id, ServicioId } = req.query
    const servicio = await prisma.servicio.findUnique( { where : { Id: Number(ServicioId) } } )
    if( !servicio ){
        return res.status(400).json({
            msg: 'no existe un servicio con el id: ' + Id
        })
    }
    let imgs =  await prisma.imgPaths.findMany({
        where: { ServicioId: Number(ServicioId) }
    })
    if( !imgs ){
        return res.status(404).json({
            msg: `el servicio: ${servicio.Id} no contiene imagenes para borrar`
        })
    }
    const paths = imgs
    imgs = imgs.map( i =>{
        return i.Id
    })
    if( ( !imgs.includes(Number(Id)) ) ){        
        return res.status(400).json({
            msg: `No existe el la imagen con el id: ${Id}`
        })
    }
    paths.map( p => {
        const pathImagen = path.join(__dirname,'../uploads/',p.Path)
        if(fs.existsSync(pathImagen)){
            fs.rm(pathImagen)
        }
    })
    await prisma.imgPaths.delete({ where: { Id: Number(Id) } })
    res.json({
        imgs
    })

}
module.exports = {
    cargarArchivo,
    actualizarImagen,
    MostrarImagen,
    deleteImagen,
}