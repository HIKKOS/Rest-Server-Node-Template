const {req, response } = require('express')
const bcryptjs = require('bcryptjs')
const User = require('../models/user')
const { generarJWT } = require('../helpers/jwtGenerator')

const login = async (req, res = response) =>{
    const { email, password } = req.body
    try {
        //verificar si el email existe
        const user = await User.findOne({ email })
        if( !user ){
            return res.status(400).json({
                msg:'usuario o contraseña invalidos'
            })
        }
        //el usuario esta activo?
        if( !user.status ){
            return res.status(400).json({
                msg:'no esta activo'
            })
        }
        //verificar contraseña
        const validPassword = bcryptjs.compareSync((password).toString(), user.password)
        if( !validPassword ){
            return res.status(400).json({
                msg:'no constraseña'
            })
        }
        //generar el JWT 
        const jwt = await generarJWT(user.id);
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