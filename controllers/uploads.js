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
        /*
        Id       Int      @id
        ServicioId   Int
        Path     String
        Servicio Servicio? @relation(fields: [ServicioId], references: [Id])
        
        */
        const dir = await uploadFile(req.files, undefined)
        await prisma.imgPaths.create({
            data : { 
                Path: dir,
                ServicioId: Number(Id)
            }
        })
        res.status(201).json({ 
            msg:`se subio la foto ${ dir } del servicio: ${servicio.Nombre} `
        })
    } catch (error) {
        console.log(error);
      res.status(400).json({error})
    }
}

const actualizarImagen = async( req = request, res = response ) => {
    const { Id, coleccion } = req.params    
    
    const servicio = await prisma.servicio.findUnique( { where: {Id:Number(Id)} } );
    const path = await prisma.imgPaths
    if( !servicio ) {
        return res.status(400).json({
            msg:`El id ${Id} no existe en la collecion: ${coleccion}`
        })
    }
    
    const paths = prisma.imgPaths.findUnique( { where: { Servico } } )
    const pathImagen = path.join(__dirname, '../uploads', servicio.img )
    if( fs.existsSync( pathImagen ) ){
        fs.unlinkSync( pathImagen )
    }

    const nombre = await uploadFile(req.files, undefined)
    servicio.img = nombre


    return res.json({
        msg: `${servicio.name} actualizo su foto con: ${nombre}`
    })
    
}
const MostrarImagen = async (req = request, res = response ) =>{
    const { Id, coleccion } = req.params        
    const servicio = await prisma.servicio.findUnique( { where: {Id: Number(Id)} } )   
    if( !servicio ){
        return res.status(404).json({
            msg: `no existe la coleccion: ${coleccion}`
        })
    }
    const img = await prisma.imgPaths.findUnique({ where: { Id: Number(Id) } })
    if( !img ){
        return res.sendFile('../assets/no-image.jpg')
    }
    const pathImagen = path.join(__dirname,'../uploads/',img.Path)
    return res.sendFile(pathImagen)      
    
}

module.exports = {
    cargarArchivo,
    actualizarImagen,
    MostrarImagen,
}