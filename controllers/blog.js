const express = require("express");
const prismaClient = require("../helpers/prisma");
const PostModel = require("../models/blog");
const router = express.Router();
const getBlogs = async (req, res) => {
  const findMany = await prismaClient.post.findMany();
  res.json({
    posts: findMany,
  });
};

// Ruta POST para crear un nuevo blog
const postBlogs = async (req, res) => {
  const post = new PostModel(req.body);
  const newPost = await prismaClient.post.create({
    data: {
      title: post.title,
      content: post.content,
      authorId: post.authorId,
    },
  });
  res.json({
    newPost,
  });
  //dame el codigo para crear un nuevo blog
};

// Ruta PUT para actualizar un blog existente
const putBlogs = (req, res) => {
  const id = req.params.id;
  const post = PostModel.fromBody(req.body);
  const updatedPost = prismaClient.post.update({
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
const deleteBlogs = (req, res) => {
  const id = req.params.id;
  const deletedPost = prismaClient.post.delete({
    where: {
      id: id,
    },
  });
  res.json({
    deletedPost,
  });
};

module.exports = {
  getBlogs,
  postBlogs,
  putBlogs,
  deleteBlogs,
};
