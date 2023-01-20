const { Router } = require('express')
const { check } = require('express-validator')
const { cargarArchivo,  actualizarImagen, mostrarImagen } = require('../controllers/uploads')
const { validarColecciones } = require('../helpers/DBvalidators')
const {validarCampos, validarCargaArchivos} = require('../middlewares')

const router = Router()
router.get('/:coleccion/:id',[
    check('coleccion').custom(c => validarColecciones(c, ['users'])), 
    validarCampos,     
],mostrarImagen)
router.post('/',validarCargaArchivos, cargarArchivo )
router.put('/:coleccion/:id', [
    validarCargaArchivos,
    check('coleccion').custom(c => validarColecciones(c, ['users'])), 
    validarCampos,     
], actualizarImagen)

module.exports = router