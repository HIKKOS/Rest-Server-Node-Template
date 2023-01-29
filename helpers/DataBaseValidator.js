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
	const servicio = await prisma.servicio.findMany({ where : { Nombre } }) 
    if( servicio.length > 0 ){
        const coleciones = await getColeciones()
        throw new Error(`Ya existe el servicio con el nombre: ${Nombre}, s:${coleciones}`)
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

const existeCorreo = async( Correo ) => {
	const tutor = await prisma.tutor.findFirst({
        where: {
            Correo
        }
    })
    if( tutor ){
        throw new Error(`el correo ${tutor.Correo } ya esta registrado`)
    }
    return true
}
const existeTelefono = async( Telefono ) => {
    Telefono = Telefono.toString()
	const tutor = await prisma.tutor.findFirst({
        where: {
            Telefono
        }
    })
    if( tutor ){
        throw new Error(`el telefono ${tutor.Telefono } ya esta registrado`)
    }
    return true
}
module.exports = {
   ExisteServicio,
   ExisteImg,
   validarColecciones,
   ExisteNombreServicio,
   existeCorreo,
   existeTelefono
}