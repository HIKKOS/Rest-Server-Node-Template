const Role = require("../models/role");
const User = require("../models/user2");
const isValidRole = async (role = "") => {
  const existeRol = await Role.findOne({ role });
  if (!existeRol) {
    throw new Error(`El rol ${role} no esta registrado en la BD`);
  }
};
const emailExist = async (email) => {
  const emailExiste = await User.findOne({ email });
  if (emailExiste) {
    throw new Error(`el correo${email} ya está registrado`);
  }
};
const UserExistById = async (id) => {
  const existeUsuario = await User.findById(id);
  if (!existeUsuario) {
    throw new Error(`el id${id} no existe`);
  }
};
module.exports = {
  isValidRole,
  emailExist,
  UserExistById,
};
