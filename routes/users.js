const { Router } = require("express");
const { check } = require("express-validator");

const {
  validarCampos,
  verifyAdminRole,
  hasRole,
  validarJWT,
} = require("../middlewares");
const {
  getUsers,
  postUsers,
  putUsers,
  deleteUsers,
} = require("../controllers/users");
const {
  isValidRole,
  emailExist,
  UserExistById,
} = require("../helpers/DBvalidators");

const router = Router();

router.get("/", getUsers);

router.put("/:id", [validarCampos], putUsers);
//segundo argumento: middlewares
//el check prepara los errores para confirmarlo en el controlador
router.post("/", /* [validarCampos] ,*/ postUsers);

router.delete("/:id", [validarCampos], deleteUsers);

module.exports = router;
