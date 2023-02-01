const { response, request } = require('express')
const {uploadFile} = require('../helpers/uploadFile')
const  { PrismaClient } = require ("@prisma/client");
const encriptarCampo = require('../helpers/encriptarCampo');
const prisma = new PrismaClient()
const actualizarDatos= async (req = request, res = response) =>{
    const { Id } = req.auth 
    const data = req.body
    if(data.Telefono){
        data.Telefono = data.Telefono.toString()
    }
    if(data.Password){
        let { Password } = req.body                
        data.PasswordTutor = encriptarCampo(Password)
        data.Password = undefined
    }
    await prisma.tutor.update({
        where: {
            Id:Number(Id)
        },
        data
    }) 
    data.PasswordTutor = undefined
    res.json({
        data
    })
} 
const actualizarFotoTutor = async(req = request, res = response) =>{
    let { Id } = req.params
    const tutor = await prisma.tutor.findUnique( { where: { Id: Number(Id) } } )
    console.log(tutor)
    try {
        const dir = await uploadFile(req.files, undefined, `/Tutores/${tutor.Id}`)
        await prisma.tutor.update({
            where:{Id: Number(Id)},
            data : { 
                Foto: dir,
            }
        })
        res.status(201).json({ 
            msg:`se subio la foto ${ dir } del tutor: ${tutor.Nombres}`
        })
    } catch (error) {
        console.log(error);
      res.status(400).json({error})
    }
}

module.exports = {
    actualizarDatos,
    actualizarFotoTutor,
}