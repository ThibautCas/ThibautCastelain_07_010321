const { User } = require('../models')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AUTH_TOKEN = process.env.AUTH_TOKEN;
const MaskData = require('maskdata');
const fs = require('fs').promises;

exports.signup = (req, res) => {
    bcrypt.hash(req.body.data.password, 10)
    .then(hash => {
        User.create({
            firstName: req.body.data.firstName,
            lastName: req.body.data.lastName,
            email: MaskData.maskEmail2(req.body.data.email),
            fonction: req.body.data.fonction,
            image: req.file ? req.file.filename : null,
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
                            fonction: user.fonction,
                            email: user.email,
                            image: req.file ? req.file.filename : null,
                            isAdmin: user.isAdmin,
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

exports.getOneUserById = (req, res) => {
    User.findOne( {where: { id: req.params.id}})
    .then((user) => { 
         res.status(200).send({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            fonction: user.fonction,
         })
    })
    .catch((error) => res.status(500).send(log(error)))
}

exports.getOneUserByEmail = (req, res) => {
    User.findOne( {where: { email: MaskData.maskEmail2(req.params.email)}})
    .then((user) => { 
         res.status(200).send({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            fonction: user.fonction,
         })
    })
    .catch((error) => res.status(500).send(log(error)))
}

exports.upgradeUser = (req, res) => {
    console.log(req.body.email);
    console.log(req.params.email);
    let email = MaskData.maskEmail2(req.body.email);
    console.log(email);
        User.update({
            isAdmin: true,
        }, {where: { email: email}})
    .then((user) => { 
         res.status(200).send({
            firstName: user.firstName,
            lastName: user.lastName,
         })
    })
    .catch((error) => res.status(500).send(log(error)))
}
exports.getAllUsers = (req, res) => {
    if(req.body.isAdmin) {
        User.findAll()
    .then((users) => res.status(200).send(users))
    .catch((error) => res.status(404).send(error))
    } else {
        return res.status(401).send({ message: "Action non autorisée!" })
    }
}

exports.updateUser = (req, res) => {
    const firstname = req.body.data.firstName;

    bcrypt.hash(req.body.data.password, 10)
    .then(hash => {
            User.update({ 
            lastName: req.body.data.lastName,
            firstName: req.body.data.firstName,
            password: hash,
            fonction: req.body.data.fonction,
        }, {where: {id: req.params.id}})
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

