//TODO need alot of improvement maybe i should add bulk delete later
import React, { useEffect, useState } from 'react';
import MetaData from '../../../components/MetaData';
import { Link } from 'react-router-dom';
import { MDBDataTable } from 'mdbreact';
import Loader from '../../../components/Loader';
import { useDispatch, useSelector } from 'react-redux';
import { allUsers, deleteUser, clearErrors } from '../../../actions/userActions';
import { toastError, toastSuccess } from '../../../util/Notification/toast';
import { DELETE_USER_RESET } from '../../../constants/userConstants';
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

const UsersList = ({ history }) => {
    const [open, setOpen] = useState(false);
    const [userId, setUserId] = useState('');

    const dispatch = useDispatch();

    const { error: deleteError, isUpdated } = useSelector((state) => state.user);
    const { loading, error, users } = useSelector((state) => state.users);

    useEffect(() => {
        dispatch(allUsers());
        if (error) {
            toastError(error);
            dispatch(clearErrors());
        }
        if (deleteError) {
            toastError(deleteError);
            dispatch(clearErrors());
        }
        if (isUpdated) {
            toastSuccess('Order deleted successfully!');
            history.push('/admin/orders');
            dispatch({ type: DELETE_USER_RESET });
        }
    }, [deleteError, dispatch, error, history, isUpdated]);

    const handleClickOpen = (id) => {
        setOpen(true);
        setUserId(id);
    };
    const handleClose = () => {
        setOpen(false);
    };
    const deleteProductHandler = (id) => {
        dispatch(deleteUser(id));
        setOpen(false);
    };
    const setUsers = () => {
        let data = {
            columns: [
                {
                    label: 'User ID',
                    field: 'id',
                    sort: 'asc',
                },
                {
                    label: 'Name',
                    field: 'name',
                    sort: 'asc',
                },
                {
                    label: 'Email',
                    field: 'email',
                    sort: 'asc',
                },
                {
                    label: 'Role',
                    field: 'role',
                    sort: 'asc',
                },
                {
                    label: 'Created_At',
                    field: 'createdAt',
                    sort: 'asc',
                },
                {
                    label: 'Actions',
                    field: 'actions',
                },
            ],
            rows: [],
        };

        users.forEach((user) => {
            data.rows.push({
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                createdAt: user.created_at,
                actions: (
                    <>
                        <Link to={`/admin/user/${user._id}`} className="btn btn-primary py-1 px-2">
                            <i className="fa fa-edit"></i>
                        </Link>
                        <button className="btn btn-danger py-1 px-2 ml-2" onClick={() => handleClickOpen(user._id)}>
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
            <MetaData title="All Users" />
            {/* table */}
            <div className="row">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>
                <div className="col-12 col-md-10">
                    <>
                        <h1 className="my-5">All Users</h1>
                        {loading ? (
                            <Loader />
                        ) : (
                            <>
                                <MDBDataTable data={setUsers()} className="px-3" bordered striped hover />
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
                            Are you sure you want to delete this user?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            No
                        </Button>
                        <Button onClick={() => deleteProductHandler(userId)} color="primary">
                            Yes
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
};

export default UsersList;
