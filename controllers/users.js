const { response, request } = require('express')
const bcryptjs = require('bcryptjs')
const Usuario = require('../models/user')
//const user = require('../models/user')

const usuariosGet = async(req = request, res = response) => {    
    const { limit = 5, page = 1 } = req.query
    const query = { status: true }
    //para ejectuar ambas promesas de manera simultanea    
    if(isNaN(limit)){
        return res.status(400).json({msg:`${limit} no es numero para el valor del limite`})
    }
    if(isNaN(page)){
        return res.status(400).json({msg:`${page} no es numero para el valor de la pagina`})
    }
    const [total, Usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
        .skip(Number ( page ))
        .limit(Number( limit ))]) 
        
    
    res.json({
        total,
        Usuarios
    })    
}

const usuariosPost = async(req, res = response) => {
    //TODO: verificar esto
   
    const { name, email, password, role} = req.body
    //solo se graban los campos que se hayan declarado con mongoose
    const user = new Usuario( { name, email, password, role } )
   
    //encriptar la contraseña
    //salt = numero de vueltas que bcrypt hara más vueltas = más encritado = más tiempo 
    const salt = bcryptjs.genSaltSync();
    user.password = bcryptjs.hashSync(password, salt)

    //guardar en la db
    await user.save()
    res.json({
        msg: 'post API - controlador',
        user
    })    
}

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
}
module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete,
}
