const { Post, User } = require('../models')
const fs = require('fs')
const jwt = require('jsonwebtoken')
require('dotenv').config()


exports.createPost = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.AUTH_TOKEN )
    const userId = decodedToken.userId;

    Post.create({ 
        title: req.body.title,
        text: req.body.text,
        image: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        userId: userId,
        likes: 0,
        include:[{ model: User, attributes: [ 'firstname', 'lastname']}]
    })
    .then((post) => res.status(201).json(post))
    .catch(error => res.status(500).json(error))


}

exports.getAllPosts = (req, res, next) => {
    const order = req.query.order
    
    Post.findAll({
        order: [(order != null ? order.split(':') : ['createdAt', 'DESC'])],
        include:[{ model: User, attributes: [ 'firstname', 'lastname']}]
    })
    .then(posts => res.status(200).json(posts))
    .catch(error => res.status(500).send(error))
}


exports.getPostId = (req, res, next) => {

    Post.findOne({ id: req.params.id}, {include: ['firstname', 'lastname']})
    .then((post) => res.status(200).send(post))
    .catch((error) => res.status(500).send(error))

}


exports.updatePost = (req, res, next) => {
    Post.updateOne({ where: {id: req.params.id}})
        .then(() => res.status(200).send({message: 'Vous avez modifié votre publication!'}))
        .catch((error) => res.status(400).send(error))      
}


exports.deletePost = (req, res, next) => {

    Post.destroy({ where: {id: req.params.id}})
        .then(() => res.status(200).send({message: 'Vous avez supprimé une publication!'}))
        .catch((error) => res.status(500).send(error))

}
