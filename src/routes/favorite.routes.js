const express = require('express');
const router = express.Router();
const cors = require('cors');

const favoriteController = require('../controllers/favorite.controller');

router.use(cors());

router.post('/favorite', favoriteController.validateFavoriteData, favoriteController.createFavorite);
router.get('/favorite', favoriteController.getFavorites);
router.get('/favorite/:id', favoriteController.getFavoriteById);
router.delete('/favorite/:id', favoriteController.deleteFavorite);

module.exports = router;
