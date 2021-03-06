import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminProducts, clearErrors } from '../../../actions/productActions';
import { allUsers } from '../../../actions/userActions';
import { allOrders } from '../../../actions/orderActions';
import { useDispatch, useSelector } from 'react-redux';
// import { toastError, toastSuccess } from '../../util/Notification/toast';
import { toastError } from '../../../util/Notification/toast';
import MetaData from '../../../components/MetaData';
import Sidebar from '../../../components/Sidebar/Sidebar';

const Dashboard = () => {
    const dispatch = useDispatch();

    const { error, products } = useSelector((state) => state.products);
    const { totalPrice, orders } = useSelector((state) => state.allOrders);
    const { users } = useSelector((state) => state.users);

    let outOfStock = products.reduce((accumulator, currentValue) => (currentValue.stock === 0 ? accumulator + 1 : accumulator), 0);

    useEffect(() => {
        dispatch(getAdminProducts());
        dispatch(allOrders());
        dispatch(allUsers());
        if (error) {
            toastError(error);
            dispatch(clearErrors());
        }
    }, [dispatch, error]);

    return (
        <>
            <MetaData title="Dashboard" />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>
                <div className="col-12 col-md-10">
                    <h1 className="my-4">Dashboard</h1>
                    <div className="row pr-4">
                        <div className="col-xl-12 col-sm-12 mb-3">
                            <div className="card text-white bg-primary o-hidden h-100">
                                <div className="card-body">
                                    <div className="text-center card-font-size">
                                        Total Amount
                                        <br /> <b>${totalPrice}</b>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="row pr-4">
                        <div className="col-xl-3 col-sm-6 mb-3">
                            <div className="card text-white bg-success o-hidden h-100">
                                <div className="card-body">
                                    <div className="text-center card-font-size">
                                        Products
                                        <br /> <b>{products && products.length}</b>
                                    </div>
                                </div>
                                <Link className="card-footer text-white clearfix small z-1" to="/admin/products">
                                    <span className="float-left">View Details</span>
                                    <span className="float-right">
                                        <i className="fa fa-angle-right"></i>
                                    </span>
                                </Link>
                            </div>
                        </div>

                        <div className="col-xl-3 col-sm-6 mb-3">
                            <div className="card text-white bg-danger o-hidden h-100">
                                <div className="card-body">
                                    <div className="text-center card-font-size">
                                        Orders
                                        <br /> <b>{orders && orders.length}</b>
                                    </div>
                                </div>
                                <Link className="card-footer text-white clearfix small z-1" to="/admin/orders">
                                    <span className="float-left">View Details</span>
                                    <span className="float-right">
                                        <i className="fa fa-angle-right"></i>
                                    </span>
                                </Link>
                            </div>
                        </div>

                        <div className="col-xl-3 col-sm-6 mb-3">
                            <div className="card text-white bg-info o-hidden h-100">
                                <div className="card-body">
                                    <div className="text-center card-font-size">
                                        Users
                                        <br /> <b>{users && users.length}</b>
                                    </div>
                                </div>
                                <Link className="card-footer text-white clearfix small z-1" to="/admin/users">
                                    <span className="float-left">View Details</span>
                                    <span className="float-right">
                                        <i className="fa fa-angle-right"></i>
                                    </span>
                                </Link>
                            </div>
                        </div>

                        <div className="col-xl-3 col-sm-6 mb-3">
                            <div className="card text-white bg-warning o-hidden h-100">
                                <div className="card-body">
                                    <div className="text-center card-font-size">
                                        Out of Stock
                                        <br /> <b>{outOfStock}</b>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
