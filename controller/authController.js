const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const crypto = require('crypto');

const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appErrors');
const Email = require('../utils/email');

const getToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, res) => {
  const token = getToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 60 * 60 * 1000,
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;
  user.active = undefined;
  user.role = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    photo: req.body.photo,
  });

  const url = `${req.protocol}://${req.get('host')}/me`;

  await new Email(newUser, url).sendWelcome();

  createSendToken(newUser, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password, jwtToken } = req.body;

  if (jwtToken) {
    const decoded = await promisify(jwt.verify)(
      jwtToken,
      process.env.JWT_SECRET,
    );

    const currentUser = await User.findById(decoded.id);
    if (currentUser) {
      return res.status(200).json({
        status: 'success',
        token: jwtToken,
        data: {
          user: currentUser,
        },
      });
    }
  }

  if (!email || !password)
    return next(new AppError('Please provide email and password', 400));

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new AppError('Incorrect email or password', 401));

  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookis.jwt) token = req.cookis.jwt;

  if (!token)
    return next(
      new AppError('You are not logged in! please log in to get access.', 401),
    );

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);
  if (!currentUser)
    return next(
      new AppError(
        'The user belonging to this token dose no longer exist',
        401,
      ),
    );

  if (currentUser.changePasswordAfter(decoded.iat))
    return next(
      new AppError('User recently changed password! please log in again.', 401),
    );

  req.user = currentUser;
  next();
});

exports.restrictTo =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403),
      );
    }

    next();
  };

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is not user with email address.', 404));
    // res.status(200).json({
    //   status: 'success',
    //   message: 'Token sent to your email!',
    // });
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to ${resetUrl}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;

    await new Email(user, resetUrl).sendPasswordReset();
    //   await sendEmail({
    //     email: user.email,
    //     subject: `Your password reset token (valid for 30 min)`,
    //     message,
    //   });
    res.status(200).json({
      status: 'success',
      message: 'Token sent to your email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        'There was an error sending the email. Try again later!',
        500,
      ),
    );
  }

  next();
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) return next(new AppError('Token is invalid or has expired', 400));

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  createSendToken(user, 200, res);
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.correctPassword(req.body.currentPassword, user.password)))
    return next(new AppError('Your current password is wrong!', 401));

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  createSendToken(user, 200, res);
});
