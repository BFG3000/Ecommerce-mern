const express = require('express');
const router = express.Router();

const {
    getProducts,
    newProduct,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    createProductReview,
    getProductReviews,
    deleteReview,
    getAdminProducts,
} = require('../controllers/productController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

//get All products
router.get('/products', getProducts);

//get All products (admin)
router.get('/admin/products', isAuthenticatedUser, authorizeRoles('admin'), getAdminProducts);

//get one product
router.get('/product/:id', getSingleProduct);

//update a product
router.put('/admin/product/:id', isAuthenticatedUser, authorizeRoles('admin'), updateProduct);

//add new product
router.post('/admin/product/new', isAuthenticatedUser, authorizeRoles('admin'), newProduct);

//delete a product
router.delete('/admin/product/:id', isAuthenticatedUser, authorizeRoles('admin'), deleteProduct);

//add review 
router.put('/review', isAuthenticatedUser, createProductReview);

//get product review 
router.get('/review', isAuthenticatedUser, getProductReviews);

//delete product review 
router.delete('/review', isAuthenticatedUser, deleteReview);

module.exports = router;
