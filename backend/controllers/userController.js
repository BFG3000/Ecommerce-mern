const User = require('../models/user');
const ErrorHandler = require('../utils/errorHandler');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');
const APIFeatures = require('../utils/apiFeatures');
const crypto = require('crypto');
const cloudinary = require('cloudinary');

//Regiser a user => api/v1/register---------------------------------------------
exports.registerUser = async (req, res, next) => {
    const { name, email, password } = req.body;
    try {
        const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
            folder: 'avatars',
            width: 150,
            crop: 'scale',
        });
        const user = await User.create({
            name,
            email,
            password,
            avatar: {
                public_id: result.public_id,
                url: result.secure_url,
            },
        });
        sendToken(user, 201, res);
    } catch (error) {
        return next(new ErrorHandler(error, 400));
    }
};

//login a user => api/v1/login----------------------------------------------
exports.loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new ErrorHandler('Please enter email and password', 400));
    }
    try {
        const user = await User.findOne({ email }).select('+password');
        //user exists?
        if (!user) {
            return next(new ErrorHandler('Invalid Email or Password', 401));
        }
        const isPasswordMatched = await user.comparePassword(password);
        if (!isPasswordMatched) {
            return next(new ErrorHandler('Invalid Email or Password', 401));
        }

        sendToken(user, 201, res);
    } catch (error) {
        return next(new ErrorHandler(error, 400));
    }
};

//Get currently logged in user /api/v1/me-------------------------------------------
exports.getLoggedUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        return next(new ErrorHandler(error, 500));
    }
};

//get all users---------------------------------------------------
exports.getAllusers = async (req, res, next) => {
    try {
        const allUsers = await User.find();
        res.status(200).json({
            success: true,
            allUsers,
        });
    } catch (error) {
        return next(new ErrorHandler(error, 404));
    }
};

//get user  /api/v1/user/:id-------------------------------------------
exports.getUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return next(new ErrorHandler('User does not exist', 404));
        }
        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        return next(new ErrorHandler(error, 500));
    }
};

//Update Password--------------------------------------------------------
exports.updatePassword = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('+password');
        //the user enter the old password then the api compare the two passswords
        const isPasswordMatched = await user.comparePassword(req.body.oldPassword);
        if (!isPasswordMatched) {
            return next(new ErrorHandler('Old password is wrong', 400));
        }
        user.password = req.body.newPassword;
        await user.save();

        sendToken(user, 200, res);
    } catch (error) {
        return next(new ErrorHandler(error, 500));
    }
};

//Update Profile-----------------------------------------------------------
exports.updateProfile = async (req, res, next) => {
    try {
        //TODO update pic

        const newUserData = {
            name: req.body.name,
            email: req.body.email,
        };

        //update avatar

        if (req.body.avatar !== '') {
            const user = await User.findById(req.user.id);
            //if image exists delete it before creating new one
            const image_id = user.avatar.public_id;
            const res = await cloudinary.v2.uploader.destroy(image_id);

            const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
                folder: 'avatars',
                width: 150,
                crop: 'scale',
            });

            newUserData.avatar = {
                public_id: result.public_id,
                url: result.secure_url,
            };
        }

        const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        });

        res.status(200).json({
            success: true,
        });
    } catch (error) {
        return next(new ErrorHandler(error, 500));
    }
};

//Admin Update Profile  /api/v1/admin/user-----------------------------------------------------------
exports.adminUpdateProfile = async (req, res, next) => {
    try {
        const newUserData = {
            name: req.body.name,
            email: req.body.email,
            role: req.body.role,
        };

        const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        });

        res.status(200).json({
            success: true,
        });
    } catch (error) {
        return next(new ErrorHandler(error, 500));
    }
};

//Admin Delete Profile  /api/v1/admin/user-----------------------------------------------------------
exports.DeleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return next(new ErrorHandler('User does not exist', 404));
        }

        if (images !== undefined) {
            //also delete pics from cloudinary
            await cloudinary.v2.uploader.destroy(user.avatar.public_id);
        }
        //delete
        await user.remove();

        res.status(200).json({
            success: true,
        });
    } catch (error) {
        return next(new ErrorHandler(error, 500));
    }
};

//logout user => api/v1/logout-------------------------------------------
exports.logOut = async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });
    res.status(200).json({
        success: true,
        message: 'Logged out',
    });
};

//Forgot Password /api/v1/password/forgot-------------------------------------------
exports.forgotPassword = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return next(new ErrorHandler('User not found', 404));
        }
        //get token
        const resetToken = user.getResetPasswordToken();
        await user.save({ validateBeforeSave: false });
        //create reset password url
        //TODO Change it back after development
        // const resetUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
        const resetUrl = `${req.protocol}://${req.get('host')}/password/reset/${resetToken}`;
        const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email then ignore it`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Shop Password Recovery',
                message,
            });
            res.status(200).json({
                success: true,
                message: `Email send to ${user.email}`,
            });
        } catch (error) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save({ validateBeforeSave: false });
            console.log(error);
            return next(new ErrorHandler(error, 500));
        }
    } catch (error) {
        return next(new ErrorHandler(error, 404));
    }
};

//Reset Password /api/v1/password/reset/:token-------------------------------------------
exports.resetPassword = async (req, res, next) => {
    try {
        //get token from the url then hash it
        hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
        //match 2 hashed tokens and also check date
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpire: {
                $gt: Date.now(),
            },
        });
        // console.log(hashedToken);
        if (!user) {
            return next(new ErrorHandler('Password reset token is invalid or has expired', 400));
        }
        // console.log(user.resetPasswordToken);
        // console.log(user.resetPasswordExpire);
        //setup new password
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        //login user ??? maybe i should remove it
        sendToken(user, 200, res);
    } catch (error) {
        return next(new ErrorHandler(error, 400));
    }
};
