const express = require('express');
const router = express.Router();
const cors = require('cors');
const multer = require('multer')
const reviewController = require('../controllers/review.controller')

router.use(cors());

router.post('/review' , multer().none() , reviewController.validateReviewData , reviewController.createReview);
router.get('/review', reviewController.getReviews);
router.get('/review/:id', reviewController.getReviewById);
router.put('/review/:id', reviewController.validateReviewData, reviewController.updateReview);
router.delete('/review/:id', reviewController.deleteReview);

module.exports = router;
