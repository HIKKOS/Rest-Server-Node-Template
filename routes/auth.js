const { Router } = require("express");
const { check } = require("express-validator");
const { login } = require("../controllers/auth");
const { validarCampos } = require("../middlewares/validadorCampos");
const router = Router();

router.post(
  "/",
  [
    check("email", "tiene que ser un correro").isEmail(),
    check("password", "contraseña incorrecta").not().isEmpty(),
    validarCampos,
  ],
  login
);
module.exports = router;
