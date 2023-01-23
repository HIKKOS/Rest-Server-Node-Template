const {request, response } = require('express')
const bcryptjs = require('bcryptjs')
const { generarJWT } = require('../helpers/jwtGenerator')
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const login = async (req = request, res = response) =>{
    const { Correo, Password } = req.body  
    try {
        //verificar si el email existe
        const user = await prisma.administrador.findUnique({where: { Correo }})
        if( !user ){
            return res.status(400).json({
                msg:'usuario o contraseña invalidos'
            })
        }
        //el usuario esta activo?
        if( !user.Activo ){
            return res.status(400).json({
                msg:'no esta activo'
            })
        }
        
        //verificar contraseña
        const validPassword = bcryptjs.compareSync((Password).toString(), user.PasswordAdmin)
        if( !validPassword ){
            return res.status(400).json({
                msg:'no constraseña'
            })
        }
        //generar el JWT 
        const jwt = await generarJWT(user.Id);
        res.json({
            msg: 'login ok',
            jwt
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: 'ocurrio un error'
        })
    }
   
}
module.exports = {
    login,
}