const express = require("express");
const { check } = require("express-validator");

const { validarCampos } = require("../middlewares");
const {
  getUsers,
  postUsers,
  putUsers,
  deleteUsers,
} = require("../controllers/users");

const router = express.Router();

router.get("/", [validarCampos], getUsers);
router.put("/:id", [validarCampos], putUsers);
router.post(
  "/",
  [
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("email", "El email es obligatorio").isEmail(),
    check("password", "El password debe de ser de 6 caracteres").isLength({
      min: 6,
    }),
    validarCampos,
  ],
  postUsers
);
router.delete("/:id", [validarCampos], deleteUsers);

module.exports = router;
