import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addItemToCart, removeItemFromCart } from '../../actions/cartActions';
import MetaData from '../../components/MetaData';
import CartItem from './CartItem/CartItem';

const CartDetails = ({ history }) => {
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart);

  //handling the +/- quantity
  const icreaseQty = (id, quantity, stock) => {
    const newQuantity = quantity + 1;
    if (newQuantity > stock) return;
    dispatch(addItemToCart(id, newQuantity));
  };
  const decreaseQty = (id, quantity) => {
    const newQuantity = quantity - 1;
    if (newQuantity <= 0) return;
    dispatch(addItemToCart(id, newQuantity));
  };
  const deleteCartitem = (id) => {
    dispatch(removeItemFromCart(id));
  };
  const checkoutHandler = () => {
    history.push('/login?redirect=shipping')
  };

  

  return (
    <>
      <MetaData title="Cart" />
      {cart.length === 0 ? (
        <h2 className="mt-5">Your Cart is Empty</h2>
      ) : (
        <>
          <h2 className="mt-5">
            Your Cart: <b>{cart.length}</b>
          </h2>

          <div className="row d-flex justify-content-between">
            <div className="col-12 col-lg-8">
              {cart.map((item) => (
                <CartItem
                  item={item}
                  key={item.product}
                  icreaseQty={icreaseQty}
                  deleteCartitem={deleteCartitem}
                  decreaseQty={decreaseQty}
                />
              ))}

              <hr />
            </div>

            <div className="col-12 col-lg-3 my-4">
              <div id="order_summary">
                <h4>Order Summary</h4>
                <hr />
                <p>
                  Subtotal:{' '}
                  <span className="order-summary-values">
                    {cart.reduce((acc, item) => acc + Number(item.quantity), 0)}{' '}
                    (Units)
                  </span>
                </p>
                <p>
                  Est. total:{' '}
                  <span className="order-summary-values">
                    $
                    {cart
                      .reduce(
                        (acc, item) => acc + item.quantity * item.price,
                        0
                      )
                      .toFixed(2)}
                  </span>
                </p>

                <hr />
                <button id="checkout_btn" className="btn btn-primary btn-block" onClick={checkoutHandler}>
                  Check out
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CartDetails;
