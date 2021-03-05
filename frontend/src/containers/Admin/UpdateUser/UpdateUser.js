import React, { useState, useEffect } from 'react';
import { toastError, toastSuccess } from '../../../util/Notification/toast';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../../components/Loader';
import MetaData from '../../../components/MetaData';
import { UPDATE_USER_RESET } from '../../../constants/userConstants';
//import { Link } from 'react-router-dom';
import { updateUser, getUserDetails, clearErrors } from '../../../actions/userActions';
import Sidebar from '../../../components/Sidebar/Sidebar';

const UpdateUser = ({ history, match }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('user');

    const dispatch = useDispatch();

    const { loading, user } = useSelector((state) => state.userDetails);
    const { isUpdated, error } = useSelector((state) => state.user);

    const userId = match.params.id;

    useEffect(() => {
        if (user && user._id !== userId) {
            dispatch(getUserDetails(userId));
        } else {
            setName(user.name);
            setEmail(user.email);
            setRole(user.role);
        }

        if (error) {
            toastError(error);
            dispatch(clearErrors());
        }
        if (isUpdated) {
            toastSuccess('User updated successfully!');
            history.push('/admin/users');
            dispatch({ type: UPDATE_USER_RESET });
        }
    }, [dispatch, error, history, isUpdated, user, userId]);

    const updateHandler = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.set('name', name);
        formData.set('email', email);
        formData.set('role', role);

        dispatch(updateUser(user._id, formData));
    };
    return (
        <>
            <MetaData title={`Update User # ${user && user.name}`} />
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>

                <div className="col-12 col-md-10">
                    {loading ? (
                        <Loader />
                    ) : (
                        <div className="row wrapper">
                            <div className="col-10 col-lg-5">
                                <form className="shadow-lg" onSubmit={updateHandler}>
                                    <h1 className="mt-2 mb-5">Update User</h1>

                                    <div className="form-group">
                                        <label htmlFor="name_field">Name</label>
                                        <input
                                            type="name"
                                            id="name_field"
                                            className="form-control"
                                            name="name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="email_field">Email</label>
                                        <input
                                            type="email"
                                            id="email_field"
                                            className="form-control"
                                            name="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="role_field">Role</label>

                                        <select
                                            id="role_field"
                                            className="form-control"
                                            name="role"
                                            value={role}
                                            onChange={(e) => setRole(e.target.value)}
                                        >
                                            <option value="user">user</option>
                                            <option value="admin">admin</option>
                                        </select>
                                    </div>

                                    <button type="submit" className="btn update-btn btn-block mt-4 mb-3">
                                        Update
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default UpdateUser;
