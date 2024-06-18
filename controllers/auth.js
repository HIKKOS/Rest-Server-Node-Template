const { req, response } = require("express");
const bcryptjs = require("bcryptjs");
const User = require("../models/user2");
const { generarJWT } = require("../helpers/jwtGenerator");
const prismaClient = require("../helpers/prisma");

const login = async (req, res = response) => {
  const { email, password } = req.body;
  try {
    const user = await prismaClient.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      return res.status(400).json({
        msg: "usuario o contraseña invalidos",
      });
    }

    //verificar contraseña
    const validPassword = bcryptjs.compareSync(
      password.toString(),
      user.password
    );
    if (!validPassword) {
      return res.status(400).json({
        msg: "no constraseña",
      });
    }
    //generar el JWT
    const jwt = await generarJWT(user.id);
    const { password: pass, createdAt, updatedAt, ...userWithoutPass } = user;
    res.json({
      jwt,
      user,
      user: userWithoutPass,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      msg: "ocurrio un error",
    });
  }
};
module.exports = {
  login,
};
