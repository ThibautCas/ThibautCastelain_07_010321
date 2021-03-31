const { PostLike } = require('../models')

exports.getLikes = (req, res) => {
    const postId = req.params.id;
    PostLike.findAndCountAll({where : {postId : postId}})
    .then((count) => res.status(200).json(count))
    .catch((error) => res.status(500).json(error));
};

exports.addLike = (req, res) => {
    const postId = req.body.postId;
    const userId = req.body.user;
    PostLike.create({
        userId: userId,
        postId: postId,
    })
    .then((postLike) => res.status(201).json(postLike))
    .catch(error => res.status(500).json(error))
}