import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './App.css';
import axios from 'axios';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import Footer from './components/Footer';
import Header from './components/Header/Header';
import Home from './containers/Home/Home';
import ProductDetails from './containers/ProductDetails/ProductDetails';
import Login from './containers/Login/Login';
import Register from './containers/Register/Register';
import Profile from './containers/Profile/Profile';
import { loadUser } from './actions/userActions';
import store from './store';
import ProtectedRoute from './components/Route/ProtectedRoute';
import UpdateProfile from './containers/UpdateProfile/UpdateProfile';
import UpdatePassword from './containers/UpdatePassword/UpdatePassword';
import ForgotPassword from './containers/ForgotPassword/ForgotPassword';
import ResetPassword from './containers/ResetPassword/ResetPassword';
import CartDetails from './containers/CartDetails/CartDetails';
import Shipping from './containers/Shipping/Shipping';
import ConfirmOrder from './containers/ConfirmOrder/ConfirmOrder';
import Payment from './containers/Payment/Payment';
import Orders from './containers/Order/Orders';
import OrderDetails from './containers/OrderDetails/OrderDetails';
import Dashboard from './containers/Admin/Dashboard/Dashboard';
import ProductList from './containers/Admin/ProductList/ProductList';
import NewProduct from './containers/Admin/NewProduct/NewProduct';
import UpdateProduct from './containers/Admin/UpdateProduct/UpdateProduct';
import OrdersList from './containers/Admin/OrdersList/OrdersList';
import ProcessOrder from './containers/Admin/ProcessOrder/ProcessOrder';
import UsersList from './containers/Admin/UsersList/UsersList';
import UpdateUser from './containers/Admin/UpdateUser/UpdateUser';
import ProductReviews from './containers/Admin/ProductReviews/ProductReviews';

function App() {
    const [stripeApiKey, setStripeApiKey] = useState('');

    const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

    useEffect(() => {
        store.dispatch(loadUser());
        async function getStripeApiKey() {
            const { data } = await axios.get('/api/v1/payment/stripe');
            setStripeApiKey(data.stripeApiKey);
        }
        getStripeApiKey();
    }, []);

    return (
        <Router>
            <div className="App">
                <Header />
                <div className="container container-fluid">
                    <Switch>
                        <Route path="/" component={Home} exact />
                        <Route path="/login" component={Login} exact />
                        <Route path="/register" component={Register} exact />
                        <Route path="/password/forgot" component={ForgotPassword} exact />
                        <Route path="/password/reset/:token" component={ResetPassword} exact />
                        <ProtectedRoute path="/shipping" component={Shipping} exact />
                        <ProtectedRoute path="/order/confirm" component={ConfirmOrder} exact />
                        <ProtectedRoute path="/me" component={Profile} exact />
                        <ProtectedRoute path="/orders/me" component={Orders} exact />
                        <ProtectedRoute path="/orders/:id" component={OrderDetails} />
                        <Route path="/cart" component={CartDetails} exact />
                        <ProtectedRoute path="/me/update" component={UpdateProfile} exact />
                        <ProtectedRoute path="/password/update" component={UpdatePassword} exact />
                        <Route path="/search/:keyword" component={Home} exact />
                        <Route path="/product/:id" component={ProductDetails} exact />
                    </Switch>
                    {/* test ??? */}
                    {stripeApiKey && (
                        <Elements stripe={loadStripe(stripeApiKey)}>
                            <ProtectedRoute path="/payment" component={Payment} exact />
                        </Elements>
                    )}
                </div>

                <ProtectedRoute path="/dashboard" isAdmin={true} component={Dashboard} exact />
                <ProtectedRoute path="/admin/products" isAdmin={true} component={ProductList} exact />
                <ProtectedRoute path="/admin/orders" isAdmin={true} component={OrdersList} exact />
                <ProtectedRoute path="/admin/users" isAdmin={true} component={UsersList} exact />
                <ProtectedRoute path="/admin/product" isAdmin={true} component={NewProduct} exact />
                <ProtectedRoute path="/admin/reviews" isAdmin={true} component={ProductReviews} exact />
                <ProtectedRoute path="/admin/user/:id" isAdmin={true} component={UpdateUser} exact />
                <ProtectedRoute path="/admin/product/:id" isAdmin={true} component={UpdateProduct} exact />
                <ProtectedRoute path="/admin/order/:id" isAdmin={true} component={ProcessOrder} exact />
                {!loading && (!isAuthenticated || user.role !== 'admin') && <Footer />}
            </div>
        </Router>
    );
}

export default App;
