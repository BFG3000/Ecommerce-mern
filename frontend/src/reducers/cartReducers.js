import {
  ADD_TO_CART,
  REMOVE_ITEM_CART,
  SAVE_SHIPPING_INFO,
} from '../constants/cartConstants';

export const cartReducer = (state = { cart: [], shippingInfo: {} }, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const newItem = action.payload;
      const isItemExist = state.cart.find((i) => i.product === newItem.product);
      if (isItemExist) {
        return {
          ...state,
          //TODO??????
          cart: state.cart.map((i) =>
            i.product === isItemExist.product ? newItem : i
          ),
        };
      } else {
        return {
          ...state,
          cart: [...state.cart, newItem],
        };
      }

    case REMOVE_ITEM_CART:
      return {
        ...state,
        cart: state.cart.filter((i) => i.product !== action.payload),
      };

    case SAVE_SHIPPING_INFO:
      return {
        ...state,
        shippingInfo: action.payload,
      };
    default:
      return state;
  }
};
