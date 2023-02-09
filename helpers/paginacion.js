const evaluarPagina = (pagina = 1, limite = 5) =>{
    return new Promise( (resolve, reject ) =>{
            let skip = 0
            pagina = Number(pagina)   
            limite = Number(limite)   
            if( pagina <= 0 )
                reject(`el parametro: page esperaba un numero mayor o igual a 1 y obtuvo ${pagina}`)
            if(limite <= 0){
                reject(`el parametro: page esperaba un numero mayor o igual a 1 y obtuvo ${limite}`)
            }
            if(pagina !== 1 ){
                skip = ( pagina - 1) * (limite)        
            }
                resolve ({ skip, pagina, limite })
        }
    )
}
module.exports = {
   evaluarPagina,
}