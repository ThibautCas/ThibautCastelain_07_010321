const express = require('express');
const router = express.Router();
const commentCtrl = require('../controllers/comment');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.post('/comment', auth, multer, commentCtrl.createComment);
router.get('/comment/:id', auth, commentCtrl.getComments);
router.put('/comment/:id', auth, commentCtrl.updateComment);
router.delete('/comment/:id', auth, commentCtrl.deleteComment);

module.exports = router;