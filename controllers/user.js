const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AUTH_TOKEN = process.env.AUTH_TOKEN;
const fs = require("fs");

exports.signup = (req, res) => {
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => {
      User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        fonction: req.body.fonction,
        image: req.file ? `${req.protocol}://${req.get("host")}/images/${req.file.filename}` 
                        : null,
        password: hash,
        createdAt: new Date(),
      })
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.login = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (email == null || password == null) {
    return res.status(400).send({ error: "Veuillez remplir tous les champs!" });
  }

  User.findOne({ where: { email: email } })
    .then((user) => {
      if (!user) {
        return res.status(401).send({ message: "Utilisateur inexistant" });
      } else {
        bcrypt
          .compare(password, user.password)
          .then((valid) => {
            if (!valid) {
              return res
                .status(401)
                .send({ message: "Mot de passe incorrect!" });
            } else {
              res.status(200).send({
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                fonction: user.fonction,
                email: user.email,
                image: user.image,
                isAdmin: user.isAdmin,
                token: jwt.sign({ userId: user.id }, AUTH_TOKEN, {
                  expiresIn: "5h",
                }),
              });
            }
            console.log("Vous êtes connecté! " + user.firstName);
          })
          .catch((error) => res.status(400).send(console.log(error)));
      }
    })
    .catch((error) => res.status(500).send(console.log(error)));
};

exports.getOneUserById = (req, res) => {
  User.findOne({ where: { id: req.params.id } })
    .then((user) => {
      res.status(200).send({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        fonction: user.fonction,
      });
    })
    .catch((error) => res.status(500).send(log(error)));
};

exports.getOneUserByEmail = (req, res) => {
  User.findOne({ where: { email: req.params.email } })
    .then((user) => {
      res.status(200).send({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        fonction: user.fonction,
      });
    })
    .catch((error) => res.status(500).send(log(error)));
};

exports.upgradeUser = (req, res) => {
  let email = req.body.email;
  User.update(
    {
      isAdmin: true,
    },
    { where: { email: email } }
  )
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((error) => res.status(500).send(log(error)));
};
exports.getAllUsers = (req, res) => {
  if (req.body.isAdmin) {
    User.findAll()
      .then((users) => res.status(200).send(users))
      .catch((error) => res.status(404).send(error));
  } else {
    return res.status(401).send({ message: "Action non autorisée!" });
  }
};

exports.updateUser = (req, res) => {
  console.log(req.body);
  const firstname = req.body.firstName;
  req.file
    ? bcrypt
        .hash(req.body.password, 10)
        .then((hash) => {
          User.update(
            {
              lastName: req.body.lastName,
              firstName: req.body.firstName,
              password: hash,
              fonction: req.body.fonction,
              image: `${req.protocol}://${req.get("host")}/images/${
                req.file.filename
              }`,
            },
            { where: { id: req.params.id } }
          )
            .then(() =>
              res.status(201).send({
                message: `La modification de l'utilisateur: ${firstname} est effectuée!`,
              })
            )
            .catch((error) => res.status(400).send(log(error)));
        })
        .catch((error) => res.status(500).json(error))
    : bcrypt
        .hash(req.body.data.password, 10)
        .then((hash) => {
          User.update(
            {
              lastName: req.body.lastName,
              firstName: req.body.firstName,
              password: hash,
              fonction: req.body.fonction,
            },
            { where: { id: req.params.id } }
          )
            .then(() =>
              res.status(201).send({
                message: `La modification de l'utilisateur: ${firstname} est effectuée!`,
              })
            )
            .catch((error) => res.status(400).send(log(error)));
        })
        .catch((error) => res.status(500).json(error));
};

exports.deleteUser = (req, res) => {
  User.findOne({ where: { id: req.params.id } })
        .then((user) => {
          user.image ? 
          fs.unlink(`images/${user.image.split("/images/")[1]}`, () => {
            User.destroy({ where: { id: req.params.id } })
              .then(() =>
                res
                  .status(200)
                  .json({ message: "La suppression est effectuée!" })
              )
              .catch((error) => res.status(400).json({ error }));
          })
          : User.destroy({ where: { id: req.params.id } })
              .then(() =>
                res
                  .status(200)
                  .json({ message: "La suppression est effectuée!" })
              )
              .catch((error) => res.status(400).json({ error }));
        })
        .catch((error) => res.status(500).json({ error }))
};
