
const  path  = require('path')
const  fs  = require('fs')

const { response, request } = require("express")

const { uploadFile } = require("../helpers")
const Usuario = require('../models/user')

const cargarArchivo = async (req= require, res = response) => {
    try {
        const nombre = await uploadFile(req.files, undefined)
        res.status(201).json({ nombre })
    } catch (error) {
      res.status(400).json({error})
    }
}

const actualizarImagen = async( req = request, res = response ) => {
    const { id, coleccion } = req.params    
    const modelo = await Usuario.findById(id);
    if( !modelo ) {
        return res.status(400).json({
            msg:`El id ${id} no existe en la collecion: ${coleccion}`
        })
    }
    if( modelo.img ){
        const pathImagen = path.join(__dirname, '../uploads', modelo.img )
        if( fs.existsSync( pathImagen ) ){
            fs.unlinkSync( pathImagen )
        }
    }
    const nombre = await uploadFile(req.files, undefined)
    modelo.img = nombre
    await modelo.save()

    return res.json({
        msg: `${modelo.name} actualizo su foto con: ${nombre}`
    })
    
}
const mostrarImagen = async (req = request, res = response ) =>{
    const { id, coleccion } = req.params    
    const modelo = await Usuario.findById(id);
    if( !modelo ) {
        return res.status(400).json({
            msg:`El id ${id} no existe en la collecion: ${coleccion}`
        })
    }
    if( modelo.img ){
        const pathImagen = path.join(__dirname, '../uploads', modelo.img )
        if( fs.existsSync( pathImagen ) ){
            return res.sendFile(pathImagen)
        }
        
    }
    const pathNoImg = path.join(__dirname, '../assets/no-image.jpg') 
    return res.sendFile(pathNoImg)

  /*   return res.json({
        id,
        coleccion,
    })
     */
}
module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImagen,

}