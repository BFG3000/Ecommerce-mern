const express = require('express');
const router = express.Router();

const {
  registerUser,
  loginUser,
  logOut,
  forgotPassword,
  resetPassword,
  getLoggedUser,
  updatePassword,
  updateProfile,
  getAllusers,
  getUserById,
  adminUpdateProfile,
  DeleteUser,
} = require('../controllers/userController');
const { isAuthenticatedUser,authorizeRoles } = require('../middlewares/auth');

//create new user
router.post('/register', registerUser);

//login user
router.post('/login', loginUser);

//logout user
router.get('/logout', logOut);

//get user by id & update user & Delete (admin)
router.get('/admin/user/:id',isAuthenticatedUser, authorizeRoles('admin'), getUserById);
router.put('/admin/user/:id',isAuthenticatedUser, authorizeRoles('admin'), adminUpdateProfile);
router.delete('/admin/user/:id',isAuthenticatedUser, authorizeRoles('admin'), DeleteUser);

//get logged in user user details
router.get('/me', isAuthenticatedUser, getLoggedUser);

//get all users 
router.get('/admin/users', isAuthenticatedUser, authorizeRoles('admin'),getAllusers);

//update user password
router.put('/password/update', isAuthenticatedUser, updatePassword);

//update user profile
router.put('/me/update', isAuthenticatedUser, updateProfile);

//forget password /api/v1/password/forgot
router.post('/password/forgot', forgotPassword);

//reset password /api/v1/reset/:token
router.put('/password/reset/:token', resetPassword);

module.exports = router;
