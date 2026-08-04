import asyncHandler from "../middleware/asyncHandler.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

// Generate access token (short-lived)
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

// Generate refresh token (long-lived)
const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Cookie options
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 24 * 60 * 60 * 1000, // 1 day
};

const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// @desc    Register a new user
// @route   POST /api/auth/register
export const registerAuth = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({ name, email, password, phone });

  if (user) {
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie("token", token, cookieOptions);
    res.cookie("refreshToken", refreshToken, refreshCookieOptions);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Login user & set cookie
// @route   POST /api/auth/login
export const loginAuth = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie("token", token, cookieOptions);
    res.cookie("refreshToken", refreshToken, refreshCookieOptions);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      isVerified: user.isVerified,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Logout user & clear cookies
// @route   POST /api/auth/logout
export const logoutAuth = asyncHandler(async (req, res) => {
  res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
  res.cookie("refreshToken", "", { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: "Logged out successfully" });
});

// @desc    Forgot password - generate reset token
// @route   POST /api/auth/forgot-password
export const forgotPasswordAuth = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Generate reset token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash and set to resetPasswordToken field
  user.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // Set expire (10 minutes)
  user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  await user.save();

  // In production, you would send this token via email
  res.status(200).json({
    message: "Password reset token generated",
    resetToken,
  });
});

// @desc    Reset password using token
// @route   POST /api/auth/reset-password
export const resetPasswordAuth = asyncHandler(async (req, res) => {
  const { resetToken, password } = req.body;

  // Hash the token from the request to compare with DB
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    res.status(400);
    throw new Error("Invalid or expired reset token");
  }

  // Set new password
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  res.status(200).json({ message: "Password reset successful" });
});

// @desc    Refresh access token using refresh cookie
// @route   POST /api/auth/refresh-token
export const refreshTokenAuth = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    res.status(401);
    throw new Error("No refresh token found");
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const newToken = generateToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    res.cookie("token", newToken, cookieOptions);
    res.cookie("refreshToken", newRefreshToken, refreshCookieOptions);

    res.status(200).json({ message: "Token refreshed successfully" });
  } catch (error) {
    res.status(401);
    throw new Error("Invalid or expired refresh token");
  }
});

// @desc    Verify email (mark user as verified)
// @route   POST /api/auth/verify-email
export const verifyEmailAuth = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user.isVerified) {
    res.status(400);
    throw new Error("Email is already verified");
  }

  user.isVerified = true;
  await user.save();

  res.status(200).json({ message: "Email verified successfully" });
});

// @desc    Get current logged-in user profile
// @route   GET /api/auth/me
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select("-password")
    .populate("wishlist")
    .populate("cart.product")
    .populate("addresses");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.status(200).json(user);
});

// @desc    Change password for logged-in user
// @route   PATCH /api/auth/change-password
export const updateChangePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  // Check if current password matches
  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) {
    res.status(401);
    throw new Error("Current password is incorrect");
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({ message: "Password changed successfully" });
});
