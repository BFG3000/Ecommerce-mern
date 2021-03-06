import {
    ALL_PRODUCTS_REQUEST,
    ALL_PRODUCTS_SUCCESS,
    ALL_PRODUCTS_FAIL,
    ADMIN_PRODUCTS_REQUEST,
    ADMIN_PRODUCTS_SUCCESS,
    ADMIN_PRODUCTS_FAIL,
    PRODUCT_DETAILS_REQUEST,
    PRODUCT_DETAILS_SUCCESS,
    PRODUCT_DETAILS_FAIL,
    CLEAR_ERRORS,
    NEW_REVIEW_REQUEST,
    NEW_REVIEW_SUCCESS,
    NEW_REVIEW_RESET,
    NEW_REVIEW_FAIL,
    NEW_PRODUCT_REQUEST,
    NEW_PRODUCT_SUCCESS,
    NEW_PRODUCT_RESET,
    NEW_PRODUCT_FAIL,
    DELETE_PRODUCT_REQUEST,
    DELETE_PRODUCT_SUCCESS,
    DELETE_PRODUCT_RESET,
    DELETE_PRODUCT_FAIL,
    UPDATE_PRODUCT_REQUEST,
    UPDATE_PRODUCT_SUCCESS,
    UPDATE_PRODUCT_RESET,
    UPDATE_PRODUCT_FAIL,
    GET_REVIEWS_REQUEST,
    GET_REVIEWS_SUCCESS,
    GET_REVIEWS_FAIL,
    DELETE_REVIEW_REQUEST,
    DELETE_REVIEW_SUCCESS,
    DELETE_REVIEW_RESET,
    DELETE_REVIEW_FAIL,
} from '../constants/productConstants';

export const productsReducer = (state = { products: [] }, action) => {
    switch (action.type) {
        case ALL_PRODUCTS_REQUEST:
        case ADMIN_PRODUCTS_REQUEST:
            return {
                loading: true,
                products: [],
            };
        case ALL_PRODUCTS_SUCCESS:
            return {
                loading: false,
                products: action.payload.products,
                productCount: action.payload.productCount,
                resPerPage: action.payload.resPerPage,
                filteredproductCount: action.payload.filteredproductCount,
            };
        case ADMIN_PRODUCTS_SUCCESS:
            return {
                loading: false,
                products: action.payload.products,
            };
        case ADMIN_PRODUCTS_FAIL:
        case ALL_PRODUCTS_FAIL:
            return {
                loading: false,
                error: action.payload,
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
};

export const productDetailsReducer = (state = { product: {} }, action) => {
    switch (action.type) {
        case PRODUCT_DETAILS_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case PRODUCT_DETAILS_SUCCESS:
            return {
                loading: false,
                product: action.payload,
            };
        case PRODUCT_DETAILS_FAIL:
            return {
                loading: false,
                ...state,
                error: action.payload,
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
};

export const productReviewReducer = (state = {}, action) => {
    switch (action.type) {
        case NEW_REVIEW_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case NEW_REVIEW_SUCCESS:
            return {
                loading: false,
                success: action.payload,
            };
        case NEW_REVIEW_FAIL:
            return {
                loading: false,
                ...state,
                error: action.payload,
            };

        case NEW_REVIEW_RESET:
            return {
                ...state,
                success: false,
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
};

//handle new product
export const newProductReducer = (state = {}, action) => {
    switch (action.type) {
        case NEW_PRODUCT_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case NEW_PRODUCT_SUCCESS:
            return {
                loading: false,
                success: action.payload.success,
                product: action.payload.product,
            };
        case NEW_PRODUCT_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case NEW_PRODUCT_RESET:
            return {
                ...state,
                success: false,
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
};

// handle update/delete product
export const ProductReducer = (state = { product: {} }, action) => {
    switch (action.type) {
        case UPDATE_PRODUCT_REQUEST:
        case DELETE_PRODUCT_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case UPDATE_PRODUCT_SUCCESS:
        case DELETE_PRODUCT_SUCCESS:
            return {
                ...state,
                loading: false,
                success: action.payload,
            };
        case UPDATE_PRODUCT_FAIL:
        case DELETE_PRODUCT_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        case UPDATE_PRODUCT_RESET:
        case DELETE_PRODUCT_RESET:
            return {
                ...state,
                success: false,
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
};

//  DELETE_REVIEW_REQUEST ,
//  DELETE_REVIEW_SUCCESS,
//  DELETE_REVIEW_RESET ,
//  DELETE_REVIEW_FAIL,
//all reviews reducer
export const reviewsReducer = (state = { reviews: [] }, action) => {
    switch (action.type) {
        case DELETE_REVIEW_REQUEST:
        case GET_REVIEWS_REQUEST:
            return {
                ...state,
                loading: true,
            };
        case GET_REVIEWS_SUCCESS:
            return {
                loading: false,
                reviews: action.payload,
            };
        case DELETE_REVIEW_SUCCESS:
            return {
                loading: false,
                success: action.payload,
            };
        case DELETE_REVIEW_FAIL:
        case GET_REVIEWS_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case DELETE_REVIEW_RESET:
            return {
                ...state,
                success: false,
            };
        case CLEAR_ERRORS:
            return {
                ...state,
                error: null,
            };
        default:
            return state;
    }
};
