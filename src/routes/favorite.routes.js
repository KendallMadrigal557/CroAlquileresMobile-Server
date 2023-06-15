const express = require('express');
const router = express.Router();
const cors = require('cors');
const multer = require('multer')
const favoriteController = require('../controllers/favorite.controller');

router.use(cors());

router.post('/favorite',multer().none(), favoriteController.validateFavoriteData, favoriteController.createFavorite);
router.get('/favorite', favoriteController.getFavorites);
router.get('/favorite/:id', favoriteController.getFavoriteById);
router.delete('/favorite/:id', favoriteController.deleteFavorite);

module.exports = router;
