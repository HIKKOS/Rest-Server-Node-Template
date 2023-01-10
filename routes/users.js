const { Router } = require('express')
const { check } = require('express-validator')
const  validarCampos  = require('../middlewares/validadorCampos')

const { 
    usuariosGet, 
    usuariosPut, 
    usuariosDelete,
    usuariosPatch,
    usuariosPost
} = require('../controllers/users')
const { 
    isValidRole, 
    emailExist, 
    UserExistById 
} = require('../helpers/DBvalidators')
const router = Router()

router.get('/', usuariosGet)

router.put('/:id',[
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
    se ovbia y solo se llama la referencia de la funcion*/
    check('role').custom( isValidRole ),  
    validarCampos
], usuariosPost)

router.delete('/:id',[
    check('id','no es un id valido').isMongoId().bail().custom( UserExistById ),
    validarCampos,
],usuariosDelete)

router.patch('/',usuariosPatch)

module.exports = router