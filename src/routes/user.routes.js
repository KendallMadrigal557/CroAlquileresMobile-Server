const express = require('express');
const router = express.Router();
const cors = require('cors');
const multer = require('multer');
const userController = require('../controllers/user.controller');

router.use(cors());

router.post('/user', multer().none(), userController.validateUserData, userController.createUser);
router.get('/user', userController.getUsers);
router.get('/user/:id', userController.getUserById);
router.put('/user/:id', userController.validateUserData, userController.updateUser);
router.delete('/user/:id', userController.deleteUser);
router.post('/user/:id/enable-two-factor', userController.enableTwoFactor); 
router.post('/login', multer().none(), userController.loginUser);
router.post('/verify-two-factor', multer().none(), userController.verifyTwoFactorCode);
router.post('/send-verification-code', multer().none(), userController.sendMailPassword);
router.post('/change-password', multer().none(), userController.changePassword);

module.exports = router;
