const Order = require('../models/order');
const Product = require('../models/product');
const ErrorHandler = require('../utils/errorHandler');

//create new order =>   /api/v1/orders ---------------------------------------------------------------------------------------------------------------------------------------------------
exports.newOrder = async (req, res, next) => {
  const {
    orderItems,
    shippingInfo,
    itemsPrice,
    shippingPrice,
    totalPrice,
    paymentInfo,
  } = req.body;
  try {
    const order = await Order.create({
      orderItems,
      shippingInfo,
      itemsPrice,
      shippingPrice,
      totalPrice,
      paymentInfo,
      paitAt: Date.now(),
      user: req.user.id,
    });

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
};

//get single order =>   /api/v1/orders/:id  ---------------------------------------------------------------------------------------------------------------------------------------------------
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'name email'
    );
    if (!order) {
      return next(new ErrorHandler('Order not found or deleted', 404));
    }
    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
};

//get logged in user orders =>   /api/v1/orders/me  ---------------------------------------------------------------------------------------------------------------------------------------------------
exports.getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
};

//get all orders =>   /api/v1/admin/orders  ---------------------------------------------------------------------------------------------------------------------------------------------------
exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find();
    let totalPrice = 0;
    orders.forEach((order) => {
      totalPrice += order.totalPrice;
    });

    res.status(200).json({
      success: true,
      totalPrice,
      orders,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
};

//update order - change status =>   /api/v1/admin/orders/:id  ---------------------------------------------------------------------------------------------------------------------------------------------------
exports.updateOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order.orderStatus === 'Deliverd') {
      return next(
        new ErrorHandler('This order has already been delivered', 400)
      );
    }
    //this is not right fix later
    // order.orderItems.forEach(async (item) => {
    //   await updateStock(item.product, item.quantity);
    // });

    order.orderStatus = req.body.status
    //TODO /something is not right here -check later
    //order.deliveredAt = req.body.date
    await order.save();
    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    return next(new ErrorHandler(error, 500));
  }
};

//Delete order =>   /api/v1/admin/orders/:id  ---------------------------------------------------------------------------------------------------------------------------------------------------
exports.deleteOrder = async (req, res, next) => {
    try {
      const order = await Order.findById(req.params.id)
      if (!order) {
        return next(new ErrorHandler('Order not found ', 404));
      }
      await order.remove();
      res.status(200).json({
        success: true,
      });
    } catch (error) {
      return next(new ErrorHandler(error, 500));
    }
  };

async function updateStock(id, quantity) {
  const product = await Product.findById(id);
  product.stock = product.stock - quantity;
  await product.save({validateBeforeSave: false});
}
