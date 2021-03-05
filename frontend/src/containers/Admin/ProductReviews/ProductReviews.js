//TODO need alot of improvement maybe i should add bulk delete later
import React, { useEffect, useState } from 'react';
import MetaData from '../../../components/MetaData';
import { MDBDataTable } from 'mdbreact';
import { useDispatch, useSelector } from 'react-redux';
import { getProductReviews, deleteReview, clearErrors } from '../../../actions/productActions';
import { toastError, toastSuccess } from '../../../util/Notification/toast';
import { DELETE_REVIEW_RESET } from '../../../constants/productConstants';
import Sidebar from '../../../components/Sidebar/Sidebar';

//mui stuff
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const ProductReviews = ({ history }) => {
    const [open, setOpen] = useState(false);
    const [productId, setProductId] = useState('');
    const [reviewId, setReviewId] = useState('');
    const dispatch = useDispatch();

    // const { error: deleteError, isUpdated } = useSelector((state) => state.user);
    const { error, reviews, success } = useSelector((state) => state.reviews);

    useEffect(() => {
        if (error) {
            toastError(error);
            dispatch(clearErrors());
        }
        if (productId !== '') {
            dispatch(getProductReviews(productId));
        }

        if (success) {
            toastSuccess('Review deleted successfully!');
            history.push('/admin/reviews');
            dispatch({ type: DELETE_REVIEW_RESET });
        }
    }, [dispatch, error, history, productId, success]);

    const handleClickOpen = (id) => {
        setOpen(true);
        setReviewId(id);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const deleteReviewHandler = (id) => {
        dispatch(deleteReview(id, productId));
        setOpen(false);
    };

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(getProductReviews(productId));
    };

    const setReviews = () => {
        let data = {
            columns: [
                {
                    label: 'Review ID',
                    field: 'id',
                    sort: 'asc',
                },
                {
                    label: 'Rating',
                    field: 'rating',
                    sort: 'asc',
                },
                {
                    label: 'Comment',
                    field: 'comment',
                    sort: 'asc',
                },
                {
                    label: 'User',
                    field: 'user',
                    sort: 'asc',
                },
                {
                    label: 'Actions',
                    field: 'actions',
                },
            ],
            rows: [],
        };

        reviews.forEach((review) => {
            data.rows.push({
                id: review._id,
                rating: review.rating,
                comment: review.comment,
                user: review.name,
                actions: (
                    <>
                        <button className="btn btn-danger py-1 px-2 ml-2" onClick={() => handleClickOpen(review._id)}>
                            <i className="fa fa-trash"></i>
                        </button>
                    </>
                ),
            });
        });
        return data;
    };

    return (
        <div>
            <MetaData title="Product Reviews" />
            {/* table */}
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>
                <div className="col-12 col-md-10">
                    <>
                        <div className="row justify-content-center mt-5">
                            <div className="col-5">
                                <form onSubmit={submitHandler}>
                                    <div className="form-group">
                                        <label htmlFor="productId_field">Enter Product ID</label>
                                        <input
                                            type="text"
                                            id="email_field"
                                            className="form-control"
                                            value={productId}
                                            onChange={(e) => setProductId(e.target.value)}
                                        />
                                    </div>

                                    <button id="search_button" type="submit" className="btn btn-primary btn-block py-2">
                                        SEARCH
                                    </button>
                                </form>
                            </div>
                        </div>
                        {reviews && reviews.length > 0 ? (
                            <>
                                <MDBDataTable data={setReviews()} className="px-3" bordered striped hover />
                            </>
                        ) : (
                            <p className="mt-5 text-center">No Reviews.</p>
                        )}
                    </>
                </div>
            </div>

            {/* confirm delete popup*/}
            <div>
                <Dialog
                    open={open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleClose}
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogTitle id="alert-dialog-slide-title">{'Delete'}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            Are you sure you want to delete this review?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            No
                        </Button>
                        <Button onClick={() => deleteReviewHandler(reviewId)} color="primary">
                            Yes
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
};

export default ProductReviews;
