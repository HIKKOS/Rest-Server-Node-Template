const { response } = require("express")

const validarCargaArchivos = (req, res = response, next) => {
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