//TODO need alot of improvement maybe i should add bulk delete later
import React, { useEffect, useState } from 'react';
import MetaData from '../../../components/MetaData';
import { Link } from 'react-router-dom';
import { MDBDataTable } from 'mdbreact';
import Loader from '../../../components/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { allOrders, deleteOrder, clearErrors } from '../../../actions/orderActions';
import { toastError, toastSuccess } from '../../../util/Notification/toast';
import { DELETE_ORDER_RESET } from '../../../constants/orderConstants';
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

const OrdersList = ({ history }) => {
    const [open, setOpen] = useState(false);
    const [orderId, setOrderId] = useState('');

    const dispatch = useDispatch();

    const { loading, error, orders } = useSelector((state) => state.allOrders);
    const { success, error: deleteError } = useSelector((state) => state.order);

    useEffect(() => {
        dispatch(allOrders());
        if (error || deleteError) {
            toastError(error ? error : deleteError);
            dispatch(clearErrors());
        }
        if (success) {
            toastSuccess('Order deleted successfully!');
            history.push('/admin/orders');
            dispatch({ type: DELETE_ORDER_RESET });
        }
    }, [deleteError, dispatch, error, history, success]);

    const handleClickOpen = (id) => {
        setOpen(true);
        setOrderId(id);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const deleteProductHandler = (id) => {
        dispatch(deleteOrder(id));
        setOpen(false);
    };
    const setOrders = () => {
        let data = {
            columns: [
                {
                    label: 'Order ID',
                    field: 'id',
                    sort: 'asc',
                },
                {
                    label: 'Created_At',
                    field: 'createdAt',
                    sort: 'asc',
                },
                {
                    label: 'No of Items',
                    field: 'numOfItems',
                    sort: 'asc',
                },
                {
                    label: 'Amount',
                    field: 'amount',
                    sort: 'asc',
                },
                {
                    label: 'Status',
                    field: 'status',
                    sort: 'asc',
                },
                {
                    label: 'Actions',
                    field: 'actions',
                },
            ],
            rows: [],
        };

        orders.forEach((order) => {
            data.rows.push({
                id: order._id,
                createdAt: order.createdAt,
                numOfItems: order.orderItems.length,
                amount: `$${order.totalPrice}`,
                status:
                    order.orderStatus && String(order.orderStatus).includes('Delivered') ? (
                        <p style={{ color: 'green' }}>{order.orderStatus}</p>
                    ) : (
                        <p style={{ color: 'red' }}>{order.orderStatus}</p>
                    ),
                actions: (
                    <>
                        <Link to={`/admin/order/${order._id}`} className="btn btn-primary py-1 px-2">
                            <i className="fa fa-eye"></i>
                        </Link>
                        <button className="btn btn-danger py-1 px-2 ml-2" onClick={() => handleClickOpen(order._id)}>
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
            <MetaData title="All Orders" />
            {/* table */}
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>
                <div className="col-12 col-md-10">
                    <>
                        <h1 className="my-5">All Orders</h1>
                        {loading ? (
                            <Loader />
                        ) : (
                            <>
                                <MDBDataTable data={setOrders()} className="px-3" bordered striped hover />
                            </>
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
                            Are you sure you want to delete this order?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            No
                        </Button>
                        <Button onClick={() => deleteProductHandler(orderId)} color="primary">
                            Yes
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
};

export default OrdersList;
