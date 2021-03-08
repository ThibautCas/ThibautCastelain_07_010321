const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const bouncer = require ("express-bouncer")(500, 900000);       // Against brute-force attacks
const verifyPassword = require('../middleware/verify-password');// Checks password is complex enough  
const auth = require('../middleware/auth');

router.post('/signup', verifyPassword, userCtrl.signup);
router.post('/login', bouncer.block, userCtrl.login);
router.get('auth/users/:id', auth, userCtrl.getOneUser);
router.get('auth/users', auth, userCtrl.getAllUsers);
router.put('auth/user/:id', auth, userCtrl.updateUser);
router.delete('auth/user/:id', auth, userCtrl.deleteUser);

module.exports = router;