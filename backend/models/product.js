const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter product name'],
    trim: true,
    maxlength: [100, 'Product name cannot exceed 100 characters'],
  },
  price: {
    type: Number,
    required: [true, 'Please enter product price'],
    trim: true,
    maxlength: [6, 'Product price cannot exceed 6 numbers'],
    default: 0.0,
  },
  description: {
    type: String,
    required: [true, 'Please enter product description'],
    maxlength: [1000, 'Product description cannot exceed 1000 characters'],
  },
  ratings: {
    type: Number,
    default: 0,
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  category: {
    type: String,
    required: [true, 'Please select a category for this product'],
    enum: {
      //TODO ADD MORE STUFF LATER
      values: [
        'Electronics',
        'Accessories',
        'Food',
        'Laptops',
        'Phones',
        'Headphones',
        'Books',
        'Home',
        'Cameras',
      ],
      messsage: 'Please select the correct category for product',
    },
  },
  seller: {
    type: String,
    required: [true, 'Please enter product seller'],
  },
  stock: {
    type: Number,
    required: [true, 'Please enter product stock'],
    maxlength: [5, 'Product stock cannot exceed 5 numbers'],
    default: 0,
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  //TODO maybe make a seprate model for it later
  reviews: [
    {
      name: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
      user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
      },
    },
  ],
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Product', productSchema);
