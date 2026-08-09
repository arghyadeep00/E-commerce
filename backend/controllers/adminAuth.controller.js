import asyncHandler from "../middleware/asyncHandler.js";
import Admin from "../models/Admin.js";
import jwt from "jsonwebtoken";

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
  sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  maxAge: 24 * 60 * 60 * 1000, // 1 day
};

const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// @desc    Auth admin & get token
// @route   POST /api/admin-auth/login
// @access  Public
export const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });

  if (admin && (await admin.matchPassword(password))) {
    const token = generateToken(admin._id);
    const refreshToken = generateRefreshToken(admin._id);

    res.cookie("token", token, cookieOptions);
    res.cookie("refreshToken", refreshToken, refreshCookieOptions);

    res.json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      token,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Logout admin / clear cookie
// @route   POST /api/admin-auth/logout
// @access  Private
export const logoutAdmin = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.cookie("refreshToken", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "Admin logged out successfully" });
});

// @desc    Create a new sub-admin
// @route   POST /api/admin-auth/create
// @access  Private (Admin only)
export const createSubAdmin = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Only allow full "admin" to create other admins
  if (req.admin.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized. Only full admins can create sub-admins.");
  }

  const adminExists = await Admin.findOne({ email });
  if (adminExists) {
    res.status(400);
    throw new Error("Admin already exists with that email");
  }

  const admin = await Admin.create({
    name,
    email,
    password,
    role: "subAdmin", // default to subAdmin
  });

  if (admin) {
    res.status(201).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    });
  } else {
    res.status(400);
    throw new Error("Invalid admin data");
  }
});

// @desc    Get current admin profile
// @route   GET /api/admin-auth/me
// @access  Private
export const getAdminMe = asyncHandler(async (req, res) => {
  const admin = await Admin.findById(req.admin._id).select("-password");

  if (admin) {
    res.json(admin);
  } else {
    res.status(404);
    throw new Error("Admin not found");
  }
});
