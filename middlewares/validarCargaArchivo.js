const { response } = require("express")

const validarCargaArchivos = (req, res = response, next) => {
    const archivo = req.files
    if(archivo == undefined){
        return res.status(400).json({
            msg: 'no se recibio el parametro archivo'
        })
    }
    if (!req.files.archivo || !req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            msg: 'no hay archivos en la peticion'
        })
    }
    next()
}
module.exports = {
   validarCargaArchivos,
}