const { Router } = require('express')
const { check } = require('express-validator')

const { 
    validarCampos, 
    validarJWT,
    validarPaginacion,
} = require('../middlewares')
const { 
    serviciosGet, serviciosPost, serviciosPut, serviciosDel,
} = require('../controllers/servicios')
const { ExisteNombreServicio, validarColecciones, ExisteServicio } = require('../helpers/DataBaseValidator')

const router = Router()

router.get('/', [
    validarJWT,
    validarPaginacion, 
    validarCampos,
],serviciosGet)
router.post('/',[
    validarJWT,
    check('Nombre').custom( ExisteNombreServicio ).isLength({min:1}),
    check('Descripcion','Se requiere este campo').isLength({min:1}),
    check('Prioritario','De ser booleano (true/false 1/0)').isBoolean(),
    check('Precio','Debe ser numerico y mayor a 0').not().isIn([0]).isNumeric().isLength({min:1}),
    validarCampos,
] ,serviciosPost)

router.put('/:Id',[
    validarJWT,
    check('Nombre','no debe ser vacio').notEmpty(),
    check('Descripcion','Se requiere este campo').notEmpty(),
    check(['Prioritario'],'De ser booleano (true/false 1/0)').isBoolean(),
    check('Precio','Debe ser numerico').isNumeric(),
    check('Id','No existe').custom(  ExisteServicio ),
    validarCampos
],serviciosPut)
router.put('/restore/:Id',[
    validarJWT,
    check('Id','No existe').custom(  ExisteServicio ),
    validarCampos
],serviciosPut)
router.delete('/:Id',[
    validarJWT,
    check('Id','No existe').custom(  ExisteServicio ),
    validarCampos
],serviciosDel)
/* router.put('/:id',[
    check('id','no es un id valido').isMongoId().bail().custom( UserExistById ),    
    check('role').custom( isValidRole ),
    check('email').custom( emailExist ),  
    validarCampos
], usuariosPut)
//segundo argumento: middlewares
//el check prepara los errores para confirmarlo en el controlador
router.post('/', [

    check('name','el name es obligatorio').not().isEmpty(),
    check('email','El correo no es valido').isEmail(),
    check('email').custom( emailExist ),  
    check('password','el password es obligatorio y debe de ser de más de 6 letras').isLength( {min: 6} ),
    /*check('rol','no es un rol permitido').isIn(['ADMIN_ROLE','USER_ROLE']),
        se puede manejar así: 
    ->  check('role').custom((rol) => isValidRole(rol) )
    pero como el rol se recibe y se pasa
    se ovbia y solo se llama la referencia de la funcion
    check('role').custom( isValidRole ),  
    validarCampos
], usuariosPost)

router.delete('/:id',[
    validarJWT,
    hasRole('VENTAS_ROLE','ADMIN_ROLE'),
    verifyAdminRole,
    check('id','no es un id valido').isMongoId().bail().custom( UserExistById ),
    validarCampos,
],usuariosDelete)

router.patch('/',usuariosPatch) */

module.exports = router