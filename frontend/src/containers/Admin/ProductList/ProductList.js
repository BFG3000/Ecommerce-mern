//TODO need alot of improvement maybe i should add bulk delete later
import React, { useEffect, useState } from 'react';
import MetaData from '../../../components/MetaData';
import { Link } from 'react-router-dom';
import { MDBDataTable } from 'mdbreact';
import Loader from '../../../components/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { getAdminProducts, deleteProduct, clearErrors } from '../../../actions/productActions';
import { toastError, toastSuccess } from '../../../util/Notification/toast';
import { DELETE_PRODUCT_RESET } from '../../../constants/productConstants';
import Sidebar from '../../../components/Sidebar/Sidebar';
//mui stuff
//i could use datagrid but they didnt add quick filter feature yet! so for now i will work with mdb or any custom component
// import { makeStyles } from '@material-ui/core/styles';
// import { Rating } from '@material-ui/lab';
// import { PreferencePanelsValue, DataGrid } from '@material-ui/data-grid';
// import { useDemoData } from '@material-ui/x-grid-data-generator';
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

const ProductList = ({ history }) => {
    const [open, setOpen] = useState(false);
    const [pid, setPid] = useState('');

    const dispatch = useDispatch();

    const { loading, error, products } = useSelector((state) => state.products);
    const { error: deleteError, success } = useSelector((state) => state.productud);

    useEffect(() => {
        dispatch(getAdminProducts());
        if (error || deleteError) {
            toastError(error ? error : deleteError);
            dispatch(clearErrors());
        }
        if (success) {
            toastSuccess('Product deleted successfully!');
            history.push('/admin/products');
            dispatch({ type: DELETE_PRODUCT_RESET });
        }
    }, [deleteError, dispatch, error, history, success]);

    const handleClickOpen = (id) => {
        setOpen(true);
        setPid(id);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const deleteProductHandler = (id) => {
        dispatch(deleteProduct(id));
        setOpen(false);
    };

    const setProducts = () => {
        let data = {
            columns: [
                {
                    label: 'ID',
                    field: 'id',
                    sort: 'asc',
                },
                {
                    label: 'Name',
                    field: 'name',
                    sort: 'asc',
                },
                {
                    label: 'Price',
                    field: 'price',
                    sort: 'asc',
                },
                {
                    label: 'Stock',
                    field: 'stock',
                    sort: 'asc',
                },
                {
                    label: 'Actions',
                    field: 'actions',
                },
            ],
            rows: [],
        };

        products.forEach((product) => {
            data.rows.push({
                id: product._id,
                name: product.name,
                price: `$${product.price}`,
                stock: product.stock,
                actions: (
                    <>
                        <Link to={`/admin/product/${product._id}`} className="btn btn-primary py-1 px-2">
                            <i className="fa fa-pencil"></i>
                        </Link>
                        <button className="btn btn-danger py-1 px-2 ml-2" onClick={() => handleClickOpen(product._id)}>
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
            <MetaData title="All Products" />
            {/* table */}
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>
                <div className="col-12 col-md-10">
                    <>
                        <h1 className="my-5">All Products</h1>
                        {loading ? (
                            <Loader />
                        ) : (
                            <>
                                <MDBDataTable data={setProducts()} className="px-3" bordered striped hover />
                            </>
                        )}
                    </>
                </div>
            </div>

            {/* confirm delete */}
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
                            Are you sure you want to delete this product?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            No
                        </Button>
                        <Button onClick={() => deleteProductHandler(pid)} color="primary">
                            Yes
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
};

export default ProductList;
