const prismaClient = require("../helpers/prisma");
const bcryptjs = require("bcryptjs");
const PostModel = require("../models/blog");
const UserModel = require("../models/user");

const getUsers = async (req, res) => {
  const findMany = await prismaClient.user.findMany();
  res.json({
    users: findMany,
  });
};

// Ruta POST para crear un nuevo blog
const postUsers = async (req, res) => {
  try {
    const user = new UserModel(req.body);
    const salt = bcryptjs.genSaltSync(10);
    const password = bcryptjs.hashSync(user.password, salt);
    const newPost = await prismaClient.user.create({
      data: {
        name: user.name,
        email: user.email,
        password: password,
        photo: user.photo,
      },
    });
    res.json({
      newPost,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
  //dame el codigo para crear un nuevo blog
};

// Ruta PUT para actualizar un blog existente
const putUsers = (req, res) => {
  const id = req.params.id;
  const post = PostModel.fromBody(req.body);
  const updatedPost = prismaClient.user.update({
    where: {
      id: id,
    },
    data: {
      title: post.title,
      content: post.content,
      authorId: post.authorId,
    },
  });
  res.json({
    post,
  });
};

// Ruta DELETE para eliminar un blog existente
const deleteUsers = (req, res) => {
  const id = req.params.id;
  const deletedPost = prismaClient.user.delete({
    where: {
      id: id,
    },
  });
  res.json({
    deletedPost,
  });
};

module.exports = {
  getUsers,
  postUsers,
  putUsers,
  deleteUsers,
};
