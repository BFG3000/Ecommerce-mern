import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toastError, toastSuccess } from '../../util/Notification/toast';
import { createOrder, clearErrors } from '../../actions/orderActions';
import { useStripe, useElements, CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import axios from 'axios';
import CheckoutSteps from '../../components/CheckoutSteps/CheckoutSteps';
import MetaData from '../../components/MetaData';

const options = {
    style: {
        base: {
            fontSize: '16px',
        },
        invalid: {
            color: '#9e2146',
        },
    },
};

const Payment = ({ history }) => {
    // const [cardNumber, setCardNumber] = useState()
    // const [cardNumber, setCardNumber] = useState()
    // const [cardNumber, setCardNumber] = useState()

    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);
    const { shippingInfo, cart } = useSelector((state) => state.cart);
    const { error } = useSelector((state) => state.newOrder);

    const stripe = useStripe();
    const elements = useElements();

    useEffect(() => {
        if (error) {
            toastError(error);
            dispatch(clearErrors());
        }
    }, [dispatch, error]);

    const order = {
        orderItems: cart,
        shippingInfo,
        // itemsPrice,
        // shippingPrice,
        //totalPrice,
        //paymentInfo
    };

    const orderInfo = JSON.parse(sessionStorage.getItem('orderInfo'));
    if (orderInfo) {
        order.itemsPrice = orderInfo.itemsPrice;
        order.shippingPrice = orderInfo.shippingPrice;
        order.totalPrice = orderInfo.totalPrice;
    }

    const paymentData = {
        amount: Math.round(orderInfo.totalPrice * 100),
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        document.querySelector('#pay_btn').disabled = true;

        let res;
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            res = await axios.post('/api/v1/payment/process', paymentData, config);

            const clientSecret = res.data.client_secret;

            if (!stripe || !elements) {
                return;
            }

            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardNumberElement),
                    billing_details: {
                        name: user.name,
                        email: user.email,
                    },
                },
            });

            if (result.error) {
                toastError(result.error.message);
                document.querySelector('#pay_btn').disabled = false;
            } else {
                if (result.paymentIntent.status === 'succeeded') {
                    order.paymentInfo = {
                        id: result.paymentIntent.id,
                        status: result.paymentIntent.status,
                    };

                    dispatch(createOrder(order));

                    toastSuccess('Your order has been created successfully!');

                    history.push('/order');
                } else {
                    toastError('There is an issue while processing your payment');
                    document.querySelector('#pay_btn').disabled = false;
                }
            }
        } catch (error) {
            document.querySelector('#pay_btn').disabled = false;

            console.error(error);
            toastError(error.response.data.message);
        }

        //history.push('/order');
    };

    return (
        <>
            <MetaData title="Checkout" />
            <CheckoutSteps shipping confirmOrder payment />
            <div className="row wrapper">
                <div className="col-10 col-lg-5">
                    <form className="shadow-lg" onSubmit={submitHandler}>
                        <h1 className="mb-4">Card Info</h1>
                        <div className="form-group">
                            <label htmlFor="card_num_field">Card Number</label>

                            <CardNumberElement type="text" id="card_num_field" className="form-control" options={options} />
                        </div>

                        <div className="form-group">
                            <label htmlFor="card_exp_field">Card Expiry</label>

                            <CardExpiryElement type="text" id="card_exp_field" className="form-control" options={options} />
                        </div>

                        <div className="form-group">
                            <label htmlFor="card_cvc_field">Card CVC</label>

                            <CardCvcElement type="text" id="card_cvc_field" className="form-control" options={options} />
                        </div>

                        <button id="pay_btn" type="submit" className="btn btn-block py-3">
                            Pay {` - $${orderInfo && orderInfo.totalPrice}`}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default Payment;
