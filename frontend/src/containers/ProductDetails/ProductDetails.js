import React, { useEffect, useState } from 'react';
import { getProductDetails, clearErrors, newReview } from '../../actions/productActions';
import { addItemToCart } from '../../actions/cartActions';
import { useDispatch, useSelector } from 'react-redux';
import { NEW_REVIEW_RESET } from '../../constants/productConstants';
import { toastError, toastSuccess } from '../../util/Notification/toast';
import { Carousel } from 'react-bootstrap';
import Loader from '../../components/Loader';
import MetaData from '../../components/MetaData';
import Rating from '@material-ui/lab/Rating';

const labels = {
    0.5: 'Useless',
    1: 'Useless+',
    1.5: 'Poor',
    2: 'Poor+',
    2.5: 'Ok',
    3: 'Ok+',
    3.5: 'Good',
    4: 'Good+',
    4.5: 'Excellent',
    5: 'Excellent+',
};

//TODO hide add cart section if no stock available
const ProductDetails = ({ match }) => {
    const [quantity, setQuantity] = useState(1);
    const [value, setValue] = useState(4);
    const [comment, setComment] = useState('');
    const [hover, setHover] = useState(-1);

    const dispatch = useDispatch();

    const { loading, error, product } = useSelector((state) => state.productDetails);
    const { error: reviewError, success } = useSelector((state) => state.myReview);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(getProductDetails(match.params.id));
        if (error || reviewError) {
            //TODO FIX LOOP
            toastError(error ? error : reviewError);
            dispatch(clearErrors());
        }
        if (success) {
            toastSuccess('Review posted successfully!');
            dispatch({ type: NEW_REVIEW_RESET });
        }
    }, [dispatch, error, match.params.id, reviewError, success]);

    const icreaseQty = () => {
        if (quantity >= product.stock) return;
        setQuantity(quantity + 1);
    };

    const decreaseQty = () => {
        if (quantity <= 1) return;
        setQuantity(quantity - 1);
    };

    const addToCart = () => {
        dispatch(addItemToCart(match.params.id, quantity));
        toastSuccess('Product Added to cart');
    };

    const reviewHandler = () => {
        const review = {
            rating: value,
            comment,
            productId: match.params.id,
        };
        dispatch(newReview(review));
    };

    //TODO i need to split thing up
    return (
        <>
            <MetaData title={product.name} />
            {loading ? (
                <Loader />
            ) : (
                <>
                    <div className="row f-flex justify-content-around">
                        <div className="col-12 col-lg-5 img-fluid" id="product_image">
                            <Carousel pause="hover">
                                {product.images &&
                                    product.images.map((image) => (
                                        <Carousel.Item key={image.public_id}>
                                            <img className="d-block w-100" src={image.url} alt={product.title} />
                                        </Carousel.Item>
                                    ))}
                            </Carousel>
                        </div>

                        <div className="col-12 col-lg-5 mt-5">
                            <h3>{product.name}</h3>
                            <p id="product_id">Product # {product._id}</p>

                            <hr />

                            <div className="rating-outer">
                                <div
                                    //TODO fix it or replace it with material ui component later
                                    className="rating-inner"
                                    style={{
                                        width: `${(product.ratings / 5) * 100}%`,
                                    }}
                                ></div>
                            </div>
                            <span id="no_of_reviews">({product.numOfReviews} Reviews)</span>

                            <hr />

                            <p id="product_price">${product.price}</p>
                            <div className="stockCounter d-inline">
                                <span className="btn btn-danger minus" onClick={decreaseQty}>
                                    -
                                </span>

                                <input type="n umber" className="form-control count d-inline" value={quantity} readOnly />

                                <span className="btn btn-primary plus" onClick={icreaseQty}>
                                    +
                                </span>
                            </div>
                            <button
                                type="button"
                                id="cart_btn"
                                className="btn btn-primary d-inline ml-4"
                                onClick={addToCart}
                                disabled={product.stock === 0}
                            >
                                Add to Cart
                            </button>

                            <hr />

                            <p>
                                Status:{' '}
                                <span id="stock_status" className={product.stock > 0 ? 'greenColor' : 'redColor'}>
                                    {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                                </span>
                            </p>

                            <hr />

                            <h4 className="mt-2">Description:</h4>
                            <p>{product.description}</p>
                            <hr />
                            <p id="product_seller mb-3">
                                Sold by: <strong>{product.seller}</strong>
                            </p>

                            {/* review button: */}
                            {user && user ? (
                                <button
                                    id="review_btn"
                                    type="button"
                                    className="btn btn-primary mt-4"
                                    data-toggle="modal"
                                    data-target="#ratingModal"
                                >
                                    Submit Your Review
                                </button>
                            ) : (
                                <div className="alert alert-danger mt-5" type="alert">
                                    Login to post your review
                                </div>
                            )}

                            <div className="row mt-2 mb-5">
                                <div className="rating w-50">
                                    <div
                                        className="modal fade"
                                        id="ratingModal"
                                        tabIndex="-1"
                                        role="dialog"
                                        aria-labelledby="ratingModalLabel"
                                        aria-hidden="true"
                                    >
                                        <div className="modal-dialog" role="document">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h5 className="modal-title" id="ratingModalLabel">
                                                        Submit Review
                                                    </h5>
                                                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                        <span aria-hidden="true">&times;</span>
                                                    </button>
                                                </div>
                                                <div className="modal-body">
                                                    <Rating
                                                        name="hover-feedback"
                                                        value={value}
                                                        precision={0.5}
                                                        onChange={(event, newValue) => {
                                                            setValue(newValue);
                                                        }}
                                                        onChangeActive={(event, newHover) => {
                                                            setHover(newHover);
                                                        }}
                                                    />
                                                    {value !== null && <div ml={2}>{labels[hover !== -1 ? hover : value]}</div>}

                                                    <textarea
                                                        name="review"
                                                        id="review"
                                                        className="form-control mt-3"
                                                        value={comment}
                                                        onChange={(e) => setComment(e.target.value)}
                                                    ></textarea>

                                                    <button
                                                        className="btn my-3 float-right review-btn px-4 text-white"
                                                        data-dismiss="modal"
                                                        aria-label="Close"
                                                        onClick={reviewHandler}
                                                    >
                                                        Submit
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* TODO remake the review system  */}
                    {product.reviews && product.reviews.length > 0 && product.reviews.map((review) => <>{review.comment}</>)}
                </>
            )}
        </>
    );
};

export default ProductDetails;
