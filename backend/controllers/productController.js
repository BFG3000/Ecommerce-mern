//const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const Product = require('../models/product');
const ErrorHandler = require('../utils/errorHandler');
const APIFeatures = require('../utils/apiFeatures');
const cloudinary = require('cloudinary');

//new product
exports.newProduct = async (req, res, next) => {
    try {
        let images = req.body.images;
        let imagesLink = [];
        for (let index = 0; index < images.length; index++) {
            const result = await cloudinary.v2.uploader.upload(images[index], { folder: 'products' });
            imagesLink.push({
                public_id: result.public_id,
                url: result.secure_url,
            });
        }

        req.body.images = imagesLink;
        req.body.user = req.user.id;
        const product = await Product.create(req.body);

        res.status(201).json({
            success: true,
            product,
        });
    } catch (error) {
        console.log('lol???????');
        next(new ErrorHandler(error, 400));
    }
};
//get all products---------------------------------------------------
exports.getProducts = async (req, res, next) => {
    const resPerPage = 4;
    const productCount = await Product.countDocuments();
    const apiFeatures = new APIFeatures(Product.find(), req.query).search().filter();

    try {
        // const products = await Product.find();
        let products = await apiFeatures.query;
        filteredproductCount = products.length;
        apiFeatures.pagination(resPerPage);
        products = await apiFeatures.query;

        res.status(200).json({
            success: true,
            productCount,
            filteredproductCount,
            products,
            resPerPage,
        });
    } catch (error) {
        //invalid string (unlikely to occur)
        return next(new ErrorHandler(error, 404));
    }
};

//GET single product---------------------------------------------------
exports.getSingleProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            //not found
            return next(new ErrorHandler('Product not found', 404));
        }
        res.status(200).json({
            success: true,
            product,
        });
    } catch (error) {
        //invalid string (unlikely to occur)
        return next(new ErrorHandler('Product not found (invalid string)', 404));
    }
};

//UPDATE product
exports.updateProduct = async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found',
        });
    }

    if (images !== undefined) {
        //delete old pics first
        for (let i = 0; i < product.images.length; i++) {
            const result = await cloudinary.v2.uploader.destroy(product.images[i].public_id);
        }

        //upload new pics
        let images = req.body.images;
        let imagesLink = [];
        for (let index = 0; index < images.length; index++) {
            const result = await cloudinary.v2.uploader.upload(images[index], { folder: 'products' });
            imagesLink.push({
                public_id: result.public_id,
                url: result.secure_url,
            });
        }
        req.body.images = imagesLink;
        req.body.user = req.user.id;
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    res.status(200).json({
        success: true,
        product,
    });
};

//Delete product
exports.deleteProduct = async (req, res, next) => {
    let product = await Product.findById(req.params.id);
    if (!product) {
        return res.status(404).json({
            success: false,
            message: 'Product not found',
        });
    }
    //also delete the images in cloudinary related to the product
    for (let i = 0; i < product.images.length; i++) {
        const result = await cloudinary.v2.uploader.destroy(product.images[i].public_id);
    }

    await product.remove();

    res.status(200).json({
        success: true,
        message: 'product is deleted',
        product,
    });
};

// Create new review => /api/v1/review
exports.createProductReview = async (req, res, next) => {
    const { rating, comment, productId } = req.body;
    const review = {
        user: req.user.id,
        name: req.user.name,
        rating: Number(rating),
        comment,
    };
    const product = await Product.findById(productId);
    //check if user already reviewed this product if yes it should update it
    //TODO im sure i could do it better
    const isReviewed = product.reviews.find((r) => r.user.toString() === req.user.id.toString());
    if (isReviewed) {
        product.reviews.forEach((review) => {
            if (review.user.toString() === req.user.id.toString()) {
                review.comment = comment;
                review.rating = rating;
            }
        });
    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    product.ratings =
        product.reviews.reduce((acc, item) => {
            item.rating + acc;
        }, 0) / product.reviews.length;
    await product.save({ validateBeforeSave: false });
    res.status(200).json({
        success: true,
    });
};

//get product reviews /api/v1/reviews
exports.getProductReviews = async (req, res, next) => {
    let product = await Product.findById(req.query.id);

    res.status(200).json({
        success: true,
        reviews: product.reviews,
    });
};

//delete product reviews /api/v1/reviews
exports.deleteReview = async (req, res, next) => {
    try {
        let product = await Product.findById(req.query.productId);

        const reviews = product.reviews.filter((review) => review._id.toString() !== req.query.id.toString());
        const numOfReviews = reviews.length;

        const ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
        console.log(reviews);
        
        product.reviews=reviews
        product.ratings=ratings
        product.numOfReviews=numOfReviews

        await product.save();

        res.status(200).json({
            success: true,
        });
    } catch (error) {
        return next(new ErrorHandler(error, 500));
    }
};

//get all products (Admin)*---------------------------------------------------
exports.getAdminProducts = async (req, res, next) => {
    try {
        const products = await Product.find();

        res.status(200).json({
            success: true,
            products,
        });
    } catch (error) {
        return next(new ErrorHandler(error, 404));
    }
};
