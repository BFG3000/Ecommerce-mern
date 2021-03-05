const express = require('express');
const router = express.Router();

const { processPayment, sendStripApiKey } = require('../controllers/paymentController');
const { isAuthenticatedUser } = require('../middlewares/auth');

router.post('/payment/process',isAuthenticatedUser, processPayment);
router.get('/payment/stripe',isAuthenticatedUser, sendStripApiKey);
module.exports = router;

