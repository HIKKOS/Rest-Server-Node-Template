const express = require("express");

const router = express.Router();
const {
  validarCampos,
  verifyAdminRole,
  hasRole,
  validarJWT,
} = require("../middlewares");
const {
  getBlogs,
  postBlogs,
  putBlogs,
  deleteBlogs,
} = require("../controllers/blog");
const { check } = require("express-validator");

// Ruta GET para obtener todos los blogs
router.get("/", [validarCampos], getBlogs);

// Ruta POST para crear un nuevo blog
router.post("/", [
  check("photo", "la foto es  obligatorio").not().isEmpty(),
  check("photo", "la foto es debe ser base64").isBase64(),
  check("content", "El content es obligatorio").not().isEmpty(),
  check("authorId", "El authorId es obligatorio").not().isEmpty(),
  validarCampos], postBlogs);

// Ruta PUT para actualizar un blog existente
router.put(
  "/:id",
  [
    check("content", "El content es obligatorio").not().isEmpty(),
    check("postId", "El postId es obligatorio").not().isEmpty(),
    check("authorId", "El authorId es obligatorio").not().isEmpty(),

    validarCampos,
  ],
  putBlogs
);

// Ruta DELETE para eliminar un blog existente
router.delete("/:id", [validarCampos], deleteBlogs);

module.exports = router;
