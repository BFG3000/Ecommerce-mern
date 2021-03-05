import React, { useEffect } from 'react';
import MetaData from '../../components/MetaData';
import { Link } from 'react-router-dom';
import { MDBDataTable } from 'mdbreact';
import Loader from '../../components/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { myOrders, clearErrors } from '../../actions/orderActions';
import { toastError } from '../../util/Notification/toast';

const Orders = () => {
    const dispatch = useDispatch();

    const { loading, error, orders } = useSelector((state) => state.myOrders);

    useEffect(() => {
        dispatch(myOrders());
        if (error) {
            toastError(error);
            dispatch(clearErrors());
        }
    }, [dispatch, error]);
    const setOrders = () => {
        const data = {
            columns: [
                {
                    label: 'Order ID',
                    field: 'id',
                    sort: 'asc',
                },
                {
                    label: 'Num of Items',
                    field: 'numOfItems',
                    sort: 'asc',
                },
                {
                    label: 'Amount Paid',
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
                    sort: 'asc',
                },
            ],
            rows: [],
        };

        orders.forEach((order) => {
            data.rows.push({
                id: order._id,
                numOfItems: order.orderItems.length,
                amount: `$${order.totalPrice}`,
                status:
                    order.orderStatus &&
                    String(order.orderStatus).includes('Delivered') ? (
                        <p style={{ color: 'green' }}>{order.orderStatus}</p>
                    ) : (
                        <p style={{ color: 'red' }}>{order.orderStatus}</p>
                    ),
                actions: (
                    <Link
                        to={`/orders/${order._id}`}
                        className="btn btn-primary"
                    >
                        <i className="fa fa-eye"></i>
                    </Link>
                ),
            });
        });
        //TODO fix the table
        return data;
    };

    return (
        <>
            <MetaData title="Your Orders" />
            <h1 className="my-5">My Orders</h1>

            {loading ? (
                <Loader />
            ) : (
                <div>
                    <MDBDataTable
                        data={setOrders()}
                        className="px-3"
                        bordered
                        striped
                        hover
                    />
                </div>
            )}
        </>
    );
};

export default Orders;
