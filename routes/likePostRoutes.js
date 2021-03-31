const express = require('express');
const router = express.Router();
const likePostCtrl = require('../controllers/likePost');
const auth = require('../middleware/auth');

router.get('/likePost/:id', auth, likePostCtrl.getLikes);
router.post('/likePost', auth, likePostCtrl.addLike);

module.exports = router;