const { Comment, User } = require('../models')
const fs = require('fs')
const jwt = require('jsonwebtoken')
require('dotenv').config()


exports.createComment = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, process.env.AUTH_TOKEN )
    const userId = decodedToken.userId;

    Comment.create({ 
        title: req.body.title,
        text: req.body.text,
        image: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        UserId: userId,
        postId: postId,
        likes: 0,
        include:[{ model: User, attributes: [ 'firstname', 'lastname']}],
    })
    .then((post) => res.status(201).json(post))
    .catch(error => res.status(500).json(error))


}

exports.getAllComments = (req, res, next) => {
    const order = req.query.order
    
    Comment.findAll({
        order: [(order != null ? order.split(':') : ['createdAt', 'DESC'])],
        include:[{ model: models.User, attributes: [ 'firstname', 'lastname']}]
    })
    .then(posts => res.status(200).json(posts))
    .catch(error => res.status(500).send(error))
}


exports.updateComment = (req, res, next) => {
    Comment.updateOne({ where: {id: req.params.id}})
        .then(() => res.status(200).send({message: 'Vous avez modifié votre publication!'}))
        .catch((error) => res.status(400).send(error))      
}


exports.deleteComment = (req, res, next) => {

    Comment.destroy({ where: {id: req.params.id}})
        .then(() => res.status(200).send({message: 'Vous avez supprimé une publication!'}))
        .catch((error) => res.status(500).send(error))

}
