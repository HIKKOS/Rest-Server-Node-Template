const genderCheck = ( ...genders ) =>{
    return (req, res, next) => {
        /* if( !req.userAuth ) {
            return res.status(500).json({
                msg:'se quiere verificar el rol sin validar token'
            })
        } */
        let { Genero } = req.body
        Genero = Genero.toUpperCase()
        if( !genders.includes( Genero )){
            return res.status(400).json({
                msg: `${Genero} no pertenece a los generos: ${genders}`
            })
        }
        next()
    }
}
module.exports = {
    genderCheck,
}