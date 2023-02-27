const { response, request } = require("express");
const { v4: uuidv4 } = require('uuid');
const { PrismaClient } = require("@prisma/client");
const { evaluarPagina } = require("../helpers/paginacion");
const jwt = require("jsonwebtoken");
const { calcularFechaExpiracion } = require("../helpers/calcular-fecha-expiracion");

const prisma = new PrismaClient();
const contratarServicio = async(req = request, res = response ) => {
    const token = req.header('x-token');
    const { Id } = jwt.verify(token, process.env.SECRETORPRIVATEKEY)
    const { IdServicio, IdAlumno } = req.params
    const { VecesContratado = 1 } = req.body
    const Servicio = await prisma.servicio.findUnique({
        where: {
            Id: IdServicio
        }
    })
    let resp = calcularFechaExpiracion(VecesContratado, Servicio.FrecuenciaDePago)
    return res.json({
        resp
    })
    /* model ServiciosDelAlumno {
        AlumnoId    String
        ServicioId  String
        FechaExpiracion DateTime
        Alumno      Alumno   @relation(fields: [AlumnoId], references: [Id])
        Servicio    Servicio @relation(fields: [ServicioId], references: [Id])
      
        @@id([AlumnoId, ServicioId])
      } */
    //! pagarlo
    //* contratar
    const servicioAlumno = {
        IdAlumno,
        IdServicio,
    }

    const IdServicioAlumno = uuidv4();
    
}

module.exports = {
    contratarServicio,

};
