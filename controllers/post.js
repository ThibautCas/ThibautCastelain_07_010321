const { Post, User } = require("../models");
const fs = require("fs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.createPost = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decodedToken = jwt.verify(token, process.env.AUTH_TOKEN);
  const userId = decodedToken.userId;
  Post.create({
    title: req.body.title,
    text: req.body.text,
    image: req.file
      ? `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
      : null,
    userId: userId,
    include: [{ model: User, attributes: ["firstName", "lastName"] }],
  })
    .then((post) => res.status(201).json(post))
    .catch((error) => res.status(500).json(error));
};

exports.getAllPosts = (req, res, next) => {
  const order = req.query.order;

  Post.findAll({
    order: [order != null ? order.split(":") : ["createdAt", "DESC"]],
    include: [{ model: User, attributes: ["firstName", "lastName"] }],
  })
    .then((posts) => res.status(200).json(posts))
    .catch((error) => res.status(500).send(error));
};

exports.getPostId = (req, res, next) => {
  Post.findOne(
    { where: { id: req.params.id } },
    { include: ["firstName", "lastName"] }
  )
    .then((post) => res.status(200).send(post))
    .catch((error) => res.status(500).send(error));
};

exports.updatePost = (req, res, next) => {
  console.log(req.body);
  Post.update(
    {
      title: req.body.title,
      text: req.body.text,
      image: req.file ?
        `${req.protocol}://${req.get("host")}/images/${req.file.filename}` :
        null,
    },
    { where: { id: req.params.id } }
  )
    .then(() =>
      res.status(200).send({ message: "Vous avez modifié votre publication!" })
    )
    .catch((error) => res.status(400).send(error));
};

exports.deletePost = (req, res, next) => {
  req.file
    ? Post.findOne({ where: { id: req.params.id } })
        .then((post) => {
          const filename = post.image.split("/images/")[1];
          fs.unlink(`images/${filename}`, () => {
            Post.destroy({ where: { id: req.params.id } })
              .then(() =>
                res
                  .status(200)
                  .json({ message: "Vous avez supprimé une publication!" })
              )
              .catch((error) => res.status(400).json({ error }));
          });
        })
        .catch((error) => res.status(500).json({ error }))
    : Post.destroy({ where: { id: req.params.id } })
        .then(() =>
          res
            .status(200)
            .json({ message: "Vous avez supprimé une publication!" })
        )
        .catch((error) => res.status(400).json({ error }));
};
