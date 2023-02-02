const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient()

const ExisteServicio = async ( Id = 0 ) => {
    if( isNaN(Id) ){
        throw new Error('Debe ser numerico')
    }
    const servicio = await prisma.servicio.findUnique({ where : { Id: Number(Id) } }) 
    if( !servicio ){
        throw new Error(`No existe el servicio con el Id: ${Id}`)
    }
    return true
}
const ExisteNombreServicio = async(Nombre = '') => {   
    const servicio = await prisma.servicio.findMany()
    const names = servicio.map(s => {
        return s.Nombre.toUpperCase()
    })
    if( names.includes(Nombre.toUpperCase()) ){
        throw new Error(`Ya existe el servicio con el nombre: ${Nombre}`)
    }
    return true

}
const getColeciones = async() => {
    const servicios = await prisma.servicio.findMany()
    const colecciones = servicios.map( s =>{
        return s.Nombre
    })
    return colecciones
}
const ExisteImg = async( Id=0, req ) => { 
    const { Servicio } = req.params
	const servicio = await prisma.servicio.findFirst({ where: { Nombre: Servicio.toString() } })    
    let imgIds = await prisma.imgPaths.findMany({ where: {ServicioId: Number(servicio.Id)} })
    imgIds = imgIds.map( p =>{
        return p.Id
    } )
    //const img = await prisma.imgPaths.findUnique({ where: {Id: Number(Id)} })
    if( !imgIds.includes(Number(Id)) )
        throw new Error(`No existe una imagen con el Id: ${Id} en la coleccion ${Servicio}, validas: ${imgIds}`) 
    return true
}
const validarColecciones = async(coleccion = '', coleciones = []) => {
    coleciones = await getColeciones()
    //TODO: VERFICAR LA COLLECION CON EL INCLUDES
    const incluida = coleciones.includes(coleccion)
    if( !incluida ){
        throw new Error(`la coleccion ${coleccion} no existe, colecciones: ${coleciones}`)
    }
    return true
}
module.exports = {
   ExisteServicio,
   ExisteImg,
   validarColecciones,
   ExisteNombreServicio,
}