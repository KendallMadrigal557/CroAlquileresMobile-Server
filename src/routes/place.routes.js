const express = require('express');
const router = express.Router();
const cors = require('cors');
const placeController = require('../controllers/place.controller');

router.use(cors());

router.post('/place', placeController.validatePlaceData, placeController.createPlace);
router.get('/place', placeController.getPlace);
router.get('/place/:id', placeController.getPlaceById);
router.put('/place/:id', placeController.validatePlaceData, placeController.updatePlace);
router.delete('/place/:id', placeController.deletePlace);

module.exports = router;
