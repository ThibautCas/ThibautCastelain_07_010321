const { User } = require('../models')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AUTH_TOKEN = process.env.AUTH_TOKEN;
const MaskData = require('maskdata');

exports.signup = (req, res) => {
    bcrypt.hash(req.body.password, 10)
    .then(hash => {
        User.create({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: MaskData.maskEmail2(req.body.email),
            function: req.body.function,
            password: hash,
            createdAt: new Date(),
        })
        .then(() => res.status(201).json({message: 'Utilisateur créé !'}))
        .catch(error => res.status(400).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};


exports.login = (req, res) => {
    const email = MaskData.maskEmail2(req.body.email);
    const password = req.body.password;

    if (email == null || password == null) {
        return res.status(400).send({ error: "Veuillez remplir tous les champs!" })
    }
    
    User.findOne({ where:{ email: email }}) 
        .then((user) => {
            if (!user) {
                return res.status(401).send({ message: "Utilisateur inexistant" })
            } else {
                bcrypt.compare(password, user.password)
                .then((valid) => {
                    if (!valid) {
                        return res.status(401).send({ message: "Mot de passe incorrect!" })
                    } else {
                        res.status(200).send({
                            id: user.id,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            function: user.function,
                            email: user.email,
                            token: jwt.sign({ userId: user.id}, AUTH_TOKEN, { expiresIn: '5h'})
                        })
                    }
                    console.log("Vous êtes connecté! " + user.firstName)
                })
                .catch((error) => res.status(400).send(console.log(error)));
            }
           
        })
        .catch((error) => res.status(500).send(console.log(error)));
};

exports.getOneUser = (req, res) => {
    User.findOne( {where: { id: req.params.id}})
    .then((user) => { 
         res.status(200).send({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            function: user.function,
         })
    })
    .catch((error) => res.status(500).send(log(error)))
    
}

exports.getAllUsers = (req, res) => {
    User.findAll()
    .then((users) => res.status(200).send(users))
    .catch((error) => res.status(404).send(error))
}

exports.updateUser = (req, res) => {
    const firstname = req.body.firstname;

    bcrypt.hash(req.body.password, 10)
    .then(hash => {
            models.User.update({ 
            email: MaskData.maskEmail2(req.body.email),
            lastname: req.body.lastname,
            firstname: req.body.firstname,
            password: hash,
            fonction: req.body.fonction,
        })
        .then(() => res.status(201).send({ message: `La modification de l'utilisateur: ${firstname} est effectuée!`}))
        .catch(error => res.status(400).send(log(error)))
    })
    .catch(error => res.status(500).json(error))
} 

exports.deleteUser = (req, res) => {
    User.destroy( 
        {where: { id: req.params.id}
    })
    .then(() => res.status(200).send({ message: 'La suppression est effectuée!'}))
    .catch((error) => res.status(500).send(error)) 
}
