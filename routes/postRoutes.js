const express = require('express');
const router = express.Router();
const postCtrl = require('../controllers/post');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.post('/post', auth, multer, postCtrl.createPost);
router.get('/post', auth, postCtrl.getAllPosts);
router.get('/getPost/:id', auth, postCtrl.getPostId);
router.put('/post/update/:id', auth, multer, postCtrl.updatePost);
router.delete('/post/delete/:id', auth, postCtrl.deletePost);

module.exports = router;