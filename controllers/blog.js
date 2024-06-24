const express = require("express");
const prismaClient = require("../helpers/prisma");
const PostModel = require("../models/blog");
const CommentModel = require("../models/comment");
const router = express.Router();
const getBlogById = async (req, res) => {
  const id = req.params.id;
  const findMany = await prismaClient.post.findUnique({
    where: {
      id: id,
    },
    include: {
      comments: {
        include: {
          author: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      author: true,
    },
  });

  res.json(findMany);
};
const getBlogs = async (req, res) => {
  const findMany = await prismaClient.post.findMany({
    orderBy: {
      createdAt: "desc",
    },

    include: {
      comments: {
        include: {
          author: true,
        },
      },
      author: true,
    },
  });

  res.json(findMany);
};

// Ruta POST para crear un nuevo blog
const postBlogs = async (req, res) => {
  const file = req.file;
  console.log(file);
  return res.json({
    body: req.body,
  });

  const post = new PostModel(req.body);

  const newPost = await prismaClient.post.create({
    data: {
      title: post.title,
      content: post.content,
      authorId: post.authorId,
      image: post.photo,
    },
  });

  res.json({
    newPost,
  });
  //dame el codigo para crear un nuevo blog
};

// Ruta PUT para actualizar un blog existente
const putBlogs = async (req, res) => {
  const comentario = new CommentModel(req.body);

  /* return res.json({
      post,
    }); */
  const post = await prismaClient.post.findUnique({
    where: {
      id: comentario.postId,
    },
    include: {
      comments: true,
    },
  });

  const newComment = await prismaClient.comment.create({
    data: {
      content: comentario.content,
      postId: comentario.postId,
      authorId: comentario.authorId,
    },
  });

  const updatedPost = await prismaClient.post.update({
    where: {
      id: comentario.postId,
    },
    data: {
      comments: {
        set: [...post.comments, newComment],
      },
    },
  });
  res.json(newComment);
};

// Ruta DELETE para eliminar un blog existente
const deleteBlogs = async (req, res) => {
  const id = req.params.id;
  const deletedPost = await prismaClient.post.delete({
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
  getBlogById,
};
