const { PrismaClient } = require('@prisma/client')
const Role = require('../models/role')
const User = require('../models/user')
const isValidRole = async (role = '' ) => {
    const existeRol = await Role.findOne( { role } )
    if(!existeRol){
        throw new Error(`El rol ${role} no esta registrado en la BD`)
    }
    return true
}
const emailExist = async ( email ) => {
    const emailExiste = await User.findOne({ email })
    if(emailExiste){
        throw new Error(`el correo${ email } ya está registrado`)
    }
    return true
}
const UserExistById = async ( id ) => {
    const prisma = new PrismaClient()
    const existeUsuario = await User.findById( id )
    if(!existeUsuario){
        throw new Error(`el id${ id } no existe`)
    }
    return true
}

const validarColecciones = (coleccion = '', colecciones = []) => {
    const incluida = colecciones.includes(coleccion)
    if( !incluida ){
        throw new Error(`la collecion ${coleccion} no es permitida, colleciones: ${colecciones}`)
    }
    return true
}
module.exports = {
    isValidRole,
    emailExist,
    UserExistById,
    validarColecciones,
    
}