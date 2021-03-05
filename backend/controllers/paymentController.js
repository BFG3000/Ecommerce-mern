const { default: Stripe } = require('stripe');
const ErrorHandler = require('../utils/errorHandler');
const stripe = require('stripe')(process.env.STRIPE_API_KEY);
// Process stripe payments => /api/v1/payment/process
exports.processPayment = async (req, res, next) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount,
      currency: 'usd',
      metadata: { integration_check: 'accept_a_payment' },
    });
    //send client key to front and validate it
    res.status(200).json({
      success: true,
      client_secret: paymentIntent.client_secret,
    });
  } catch (error) {
    next(new ErrorHandler(error, 500));
  }
};

// send stripe api key => /api/v1/stripe
exports.sendStripApiKey = async (req, res, next) => {
  res.status(200).json({
    stripeApiKey: process.env.STRIPE_SECRET_KEY,
  });
};
