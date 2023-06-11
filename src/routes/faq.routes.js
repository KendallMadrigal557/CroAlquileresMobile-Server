const express = require('express');
const router = express.Router();
const cors = require('cors');

const faqController = require('../controllers/faq.controller');

router.use(cors());

router.post('/faq', faqController.validateFAQData, faqController.createFAQ);
router.get('/faq', faqController.getFAQs);
router.get('/faq/:id', faqController.getFAQById);
router.put('/faq/:id', faqController.validateFAQData, faqController.updateFAQ);
router.delete('/faq/:id', faqController.deleteFAQ);

module.exports = router;
