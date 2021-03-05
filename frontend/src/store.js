import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import {
    productsReducer,
    productDetailsReducer,
    productReviewReducer,
    newProductReducer,
    ProductReducer,
    reviewsReducer,
} from './reducers/productReducers';
import { userAuthReducer, userReducer, forgotPasswordReducer, allUserReducer, userDetailsReducer } from './reducers/userReducers';
import { cartReducer } from './reducers/cartReducers';
import { newOrderReducer, myOrdersReducer, orderDetailsReducer, updateOrderReducer, allOrdersReducers } from './reducers/orderReducers';

const reducer = combineReducers({
    products: productsReducer,
    productDetails: productDetailsReducer,
    auth: userAuthReducer,
    user: userReducer,
    forgotPassword: forgotPasswordReducer,
    cart: cartReducer,
    newOrder: newOrderReducer,
    myOrders: myOrdersReducer,
    orderDetails: orderDetailsReducer,
    myReview: productReviewReducer,
    newProduct: newProductReducer,
    productud: ProductReducer,
    allOrders: allOrdersReducers,
    order: updateOrderReducer,
    users: allUserReducer,
    userDetails: userDetailsReducer,
    reviews: reviewsReducer,
});
// Note i should add cart field to logged on user and somehow append the two when he log in
let initialState = {
    cart: {
        cart: localStorage.getItem('userCart') ? JSON.parse(localStorage.getItem('userCart')) : [],
        shippingInfo: localStorage.getItem('shippingInfo') ? JSON.parse(localStorage.getItem('shippingInfo')) : {},
    },
};

const middleware = [thunk];

const store = createStore(reducer, initialState, composeWithDevTools(applyMiddleware(...middleware)));

export default store;
