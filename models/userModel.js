const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const userSchma = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
    trim: true,
    maxlength: [40, 'max length most be 40 chars'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    trim: true,
    maxlength: [100, 'max length most be 100 chars'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: { type: String, default: 'default.jpg' },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please provide a passord'],
    trim: true,
    minlength: [8, 'min length most be 8 chars'],
    maxlength: [100, 'max length most be 100 chars'],
    select: false,
    // validate: {
    //   validator(val) {
    //     return val.includes(' ');
    //   },
    //   message: `Password should be not contain spaces`,
    // },
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      validator(val) {
        return val === this.password;
      },
      message: `Password are not the same!`,
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: { type: Boolean, default: true, select: false },
});

userSchma.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

userSchma.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchma.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchma.methods.correctPassword = async function (curPassword, userPassword) {
  return await bcrypt.compare(curPassword, userPassword);
};

userSchma.methods.changePasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changeTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );

    return JWTTimestamp < changeTimestamp;
  }

  return false;
};

userSchma.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 30 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchma);

module.exports = User;
