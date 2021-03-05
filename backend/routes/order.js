const express = require('express');
const router = express.Router();

const { newOrder,getOrder,getUserOrders,getAllOrders,updateOrder,deleteOrder } = require('../controllers/orderController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

//new order
router.post('/orders', isAuthenticatedUser, newOrder);

//get all orders (admin)
router.get('/admin/orders/', isAuthenticatedUser, authorizeRoles('admin'),getAllOrders);

//update order - status (admin)
router.put('/admin/orders/:id', isAuthenticatedUser, authorizeRoles('admin'),updateOrder);

//delete order (admin)
router.delete('/admin/orders/:id', isAuthenticatedUser, authorizeRoles('admin'),deleteOrder);

//get logged in user orders
router.get('/orders/me', isAuthenticatedUser, getUserOrders);

//get order by id
router.get('/orders/:id', isAuthenticatedUser, getOrder);



module.exports = router;
