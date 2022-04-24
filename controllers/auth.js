const crypto = require("crypto");
const randomize = require("randomatic");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");

const {
  JWT_SECRET,
  JWT_EXPIRE,
  JWT_COOKIE_EXPIRE,
  NODE_ENV,
} = require("../config/config");

const { fast2sms, generateOTP } = require("../utils/fastSms");

// @desc      Register user
// @route     POST /api/v1/auth/register/department
// @access    Protect
exports.register = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  sendTokenResponse(user, 200, res);
});

// @desc      Login User and send OTP
// @route     POST /api/v1/auth/login
// @access    Public
exports.login = asyncHandler(async (req, res, next) => {
  const { phone } = req.body;

  // Validate phone & otp
  if (!phone) {
    return next(new ErrorResponse("Please provide a phone number", 400));
  }

  const user = await User.findOne({ phone });

  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  const otp = generateOTP(6);
  const message = `Your OTP is ${otp}`;
  user.otp = {
    code: otp,
    isValid: true,
    expiresAt: Date.now() + 300000,
  };
  await user.save();

  await fast2sms({ message, contactNumber: phone }, next);

  // sendTokenResponse(decodedUser, 200, res);
  res.status(200).json({
    success: true,
    data: "Otp Sent!",
  });
});

// @desc      Verify OTP
// @route     POST /api/v1/auth/verify-otp
// @access    Public
exports.verifyOtp = asyncHandler(async (req, res, next) => {
  const { phone, otp } = req.body;

  // Validate phone & otp
  if (!phone || !otp) {
    return next(new ErrorResponse("Please provide an OTP", 400));
  }

  const user = await User.findOne({
    phone,
    "otp.code": otp,
    "otp.isValid": true,
    "otp.expiresAt": { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  user.otp = null;

  await user.save();

  sendTokenResponse(user, 200, res);
});

// @desc      Get current logged in user
// @route     GET /api/v1/auth/me
// @access    Private
exports.getMe = asyncHandler(async (req, res, next) => {
  // user is already available in req due to the protect middleware
  const user = await User.findById(req.user._id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc      Log user out / clear cookie
// @route     GET /api/v1/auth/logout
// @access    Public
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(Date.now() + JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  if (NODE_ENV === "production") {
    options.secure = true;
  }

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
};
