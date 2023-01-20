const evaluarPagina = (pagina = 1, limite = 5) =>{
    let skip = 0
    pagina = Number(pagina)   
    limite = Number(limite)   
    if(pagina !== 1 ){
        skip = ( pagina - 1) * (limite)        
    }
    return ({ skip, pagina, limite })
}
module.exports = {
   evaluarPagina,
}