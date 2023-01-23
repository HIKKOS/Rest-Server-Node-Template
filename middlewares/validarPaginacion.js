const { request, response } = require("express")

const validarPaginacion = (req = request, res = response, next) =>{
    const { limit = 1, page = 5 } = req.query
    if(isNaN( limit ) ){
        return res.status(400).json({msg: `limite esperaba un numero y obtuvo: ${limit}`})
    }
    if(isNaN( page )){        
        return res.status(400).json({msg: `pagina esperaba un numero y obtuvo: ${page}`})
    }
    next()
}
module.exports = {
   validarPaginacion,
}