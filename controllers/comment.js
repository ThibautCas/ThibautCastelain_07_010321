const { Comment, User } = require("../models");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.createComment = (req, res, next) => {
  console.log(req.body);
  Comment.create({
    text: req.body.text,
    userId: req.body.user,
    postId: req.body.postId,
    likes: 0,
    include: [{ model: User, attributes: ["firstName", "lastName"] }],
  })
    .then((comment) => res.status(201).json(comment))
    .catch((error) => res.status(500).json(error));
};

exports.getComments = (req, res, next) => {
  const order = req.query.order;

  Comment.findAll(
    { where: { postId: req.params.id } },
    {
      order: [order != null ? order.split(":") : ["createdAt", "DESC"]],
      include: [{ model: User, attributes: ["firstName", "lastName"] }],
    },

  )
    .then((comments) => res.status(200).json(comments))
    .catch((error) => res.status(500).send(error));
};

exports.updateComment = (req, res, next) => {
  Comment.updateOne({ where: { id: req.params.id } })
    .then(() =>
      res.status(200).send({ message: "Vous avez modifié votre publication!" })
    )
    .catch((error) => res.status(400).send(error));
};

exports.deleteComment = (req, res, next) => {
  Comment.destroy({ where: { id: req.params.id } })
    .then(() =>
      res.status(200).send({ message: "Vous avez supprimé une publication!" })
    )
    .catch((error) => res.status(500).send(error));
};
