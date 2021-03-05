import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
//import Loader from '../../components/Loader';
import MetaData from '../../components/MetaData';
import { UPDATE_PASSWORD_RESET } from '../../constants/userConstants';
//import { Link } from 'react-router-dom';
import {
  updatePassword,
  clearErrors,
} from '../../actions/userActions';

const UpdatePassword = ({ history }) => {
  const [newPassword, setNewPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');

  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const { loading, isUpdated, error } = useSelector((state) => state.user);

  useEffect(
    () => {
      if (error) {
        toast.error(error, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
      if (isUpdated) {
        toast.success('Password updated successfully!', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        history.push('/me');
        dispatch({ type: UPDATE_PASSWORD_RESET });
      }
      dispatch(clearErrors());
    },
    [dispatch, error, history, isUpdated, user]
  );

  const updateHandler = (e) => {
    e.preventDefault();

    const passwords = {
      oldPassword,
      newPassword,
    };

    dispatch(updatePassword(passwords));
  };
  return (
    <>
      <MetaData title="Update Password" />
      <div className="row wrapper">
        <div className="col-10 col-lg-5">
          <form className="shadow-lg" onSubmit={updateHandler}>
            <h1 className="mt-2 mb-5">Update Password</h1>
            <div className="form-group">
              <label htmlFor="old_password_field">Old Password</label>
              <input
                type="password"
                id="old_password_field"
                className="form-control"
                value={oldPassword}
                onChange={(e)=>setOldPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="new_password_field">New Password</label>
              <input
                type="password"
                id="new_password_field"
                className="form-control"
                value={newPassword}
                onChange={(e)=>setNewPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="btn update-btn btn-block mt-4 mb-3" disabled={loading ? true : false}>
              Update Password
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default UpdatePassword;
