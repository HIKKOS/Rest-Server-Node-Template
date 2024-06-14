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

// Ruta GET para obtener todos los blogs
router.get("/", [validarCampos], getBlogs);

// Ruta POST para crear un nuevo blog
router.post("/", [validarCampos], postBlogs);

// Ruta PUT para actualizar un blog existente
router.put("/:id", [validarCampos], putBlogs);

// Ruta DELETE para eliminar un blog existente
router.delete("/:id", [validarCampos], deleteBlogs);

module.exports = router;
