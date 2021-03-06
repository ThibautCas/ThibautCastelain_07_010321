const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const bouncer = require ("express-bouncer")(500, 900000);       // Against brute-force attacks
const verifyPassword = require('../middleware/verify-password');// Checks password is complex enough  
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');


router.post('/signup', multer, verifyPassword, userCtrl.signup);
router.post('/login', bouncer.block, userCtrl.login);
router.get('/auth/user/ById/:id', auth, userCtrl.getOneUserById);  
router.get('/auth/user/byEmail/:email', auth, userCtrl.getOneUserByEmail);
router.put('/auth/user/byEmail', auth, userCtrl.upgradeUser);
router.get('/auth/users', auth, userCtrl.getAllUsers);
router.put('/auth/user/update/:id', multer, auth, userCtrl.updateUser);
router.delete('/auth/user/delete/:id', multer, auth, userCtrl.deleteUser);

module.exports = router;