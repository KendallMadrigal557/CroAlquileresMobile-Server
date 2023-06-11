const express = require('express');
const router = express.Router();
const cors = require('cors');

const userController = require('../controllers/user.controller');

router.use(cors());

router.post('/user', userController.validateUserData, userController.createUser);
router.get('/user', userController.getUsers);
router.get('/user/:id', userController.getUserById);
router.put('/user/:id', userController.validateUserData, userController.updateUser);
router.delete('/user/:id', userController.deleteUser);

module.exports = router;
