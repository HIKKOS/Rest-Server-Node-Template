const { Schema, model } = require('mongoose')
const UsuarioSchema = Schema ({
    name:{
        type: String,
        required:[true, 'el nombre es obligatorio']
    },
    email:{
        type: String,
        required:[true, 'el nombre es obligatorio'],
        unique:true
    },
    password:{
        type: String,
        required:[true, 'la contraseña es obligatorio']
    },
    img:{
        type: String,
    },
    role: {
        type: String,
        required: true,
       
    },
    status: {
        type: Boolean,
        default: true,
    },
    google: {
        type: Boolean,
        default: false,
    }
})
UsuarioSchema.methods.toJSON = function () {
    //extrae __v, password y guardar todo lo demas en user
    const { __v,password,_id, ...user } = this.toObject()
    user.uid = _id
    return user
}
module.exports = model('User', UsuarioSchema)