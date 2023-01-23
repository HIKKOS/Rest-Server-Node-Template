const { response, request } = require('express')

const bcryptjs = require('bcryptjs')
const  { PrismaClient, prisma } = require ("@prisma/client");
const { now } = require('mongoose');

//const user = require('../models/user')

const serviciosGet = async(req = request, res = response) => {        
    res.json({
        msg:'serviciosGet CAMBIARget',
    })
}

const serviciosPost = async(req = request, res = response) => {
   /*--`Id` INTEGER NOT NULL AUTO_INCREMENT,
    `Nombres` VARCHAR(75) NOT NULL,
    `Prioritario` BOOLEAN NOT NULL DEFAULT true,
    `Descripcion` VARCHAR(500) NOT NULL,
    `FechaPago` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `Precio` DOUBLE NOT NULL DEFAULT 0.0,
    `AlumnoId` INTEGER NOT NULL, */
    const { Nombres,
        Prioritario,
        Descripcion,
        FechaPago,
        Precio,
    } = req.body 

    res.json({
        msg: 'serviciosPost - controlador',
    })    
}
/*

const usuariosPut = async (req, res = response) => {
    const id = req.params.id
    const { _id, password, google, ...other } = req.body
    //TODO: validar contra BD

    if( password ){
        const salt = bcryptjs.genSaltSync();
        other.password = bcryptjs.hashSync(password, salt)
    }
     await Usuario.findByIdAndUpdate( id, other )
    res.json({
        id
    })    
}
const usuariosPatch = (req, res = response) => {
    res.json({
        msg: 'patch API - controlador'
    })    
}

const usuariosDelete = async (req, res = response) => {
    const { id } = req.params
    //borrar de manera FISICA NO HACER
    //const user = await Usuario.findByIdAndDelete(id)
    const uid = req.uid
    const userAuth = req.userAuth
    const user = await Usuario.findByIdAndUpdate(id, { status: false })
    res.json({
        user,
        userAuth,
    })    
} */
module.exports = {
    serviciosGet,
    serviciosPost,
    /*usuariosPut,
    usuariosPatch,
    usuariosDelete, */
}
