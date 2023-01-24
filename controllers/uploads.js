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
        const dir = await uploadFile(req.files, undefined, servicio.Nombre)
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
    const { Id, Servicio } = req.params    
    const imgPath = await prisma.imgPaths.findUnique({ where : { Id: Number(Id) } })
    try {
        const nombre = await uploadFile(req.files, undefined,Servicio)
        await prisma.imgPaths.update({ 
            data:{
                Path: nombre
            },
            where: { Id:Number(Id) },
    
        })
        const pathImg = path.join(__dirname,'../uploads/',Servicio.toString(), imgPath.Path)
        if(fs.existsSync(pathImg)){
            fs.unlinkSync(pathImg)
        }
        return res.status(200).json({ 
            msg:`el serivicio ${Servicio} actualizo la foto con id ${Id} con el archivo ${nombre}`
        })
    } catch (error) {
        console.log(error);
        return res.status(400).json({error})
    }
    
}
const MostrarImagen = async (req = request, res = response ) => {
    const { Servicio, Id } = req.params        
    
    const img = await prisma.imgPaths.findUnique({ where: { Id: Number(Id) } })
    if( !img ){
        return res.status(400).json({
            msg:`No existe una imagen con id ${Id}`
        })
    }
    const pathImagen = path.join(__dirname,'../uploads/',Servicio,img.Path)
    if( !fs.existsSync(pathImagen) ){
        const pathImagen = path.join(__dirname,'../assets/no-image.jpg')
        return res.sendFile(pathImagen)
    }
    return res.sendFile(pathImagen)      
    
}
const deleteImagen = async (req = request, res = response) => {
    const { Id, ServicioId } = req.query
    const servicio = await prisma.servicio.findUnique( { where : { Id: Number(ServicioId) } } )
    let imgs =  await prisma.imgPaths.findMany({
        where: { ServicioId: Number(ServicioId) }
    })
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
       msg: `El serivicio ${servicio.Nombre} borro la foto con id: ${Id}`
    })

}
module.exports = {
    cargarArchivo,
    actualizarImagen,
    MostrarImagen,
    deleteImagen,
}