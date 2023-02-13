const { response, request } = require("express");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const getPagos = async(req = request, res = response) => {
    const pago = await prisma.pago.findMany()
    return res.json(pago)
}
const postPagos = async(req = request, res = response) => {
    const { TutorId, ServicioId, AlumnoId } = req.body
    return res.json({
        TutorId, ServicioId, AlumnoId
    })
}
module.exports = {
    getPagos,
    postPagos,

}