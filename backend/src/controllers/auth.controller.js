import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ok, created } from "../utils/apiResponse.js";
import { ah } from "../utils/asyncHandler.js";

const MAX_ADMINS = 2;
const allowedAdmins = process.env.ALLOWED_ADMINS?.split(",") || [];

const signToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });

// ---------------------- SIGNUP ----------------------
export const signup = ah(async (req, res) => {
  const { name, email, password, role } = req.body;

  // check existing user
  const exists = await User.findOne({ email });
  if (exists)
    return res
      .status(400)
      .json({ success: false, error: "Email already in use" });

  const hash = await bcrypt.hash(password, 10);

  let finalRole = "citizen"; // default

  if (role === "admin") {
    // check if email is in allowed list
    if (!allowedAdmins.includes(email)) {
      return res
        .status(403)
        .json({ success: false, error: "This email is not allowed as admin" });
    }

    // check current admin count
    const adminCount = await User.countDocuments({ role: "admin" });
    if (adminCount >= MAX_ADMINS) {
      return res
        .status(403)
        .json({ success: false, error: "Admin limit reached" });
    }

    finalRole = "admin";
  }

  const user = await User.create({
    name,
    email,
    password: hash,
    role: finalRole,
  });

  const token = signToken(user._id, user.role);

  return created(res, {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  });
});


export const login = ah(async (req, res) => {
  const { email, password, role } = req.body;

  // check user by email
  const user = await User.findOne({ email });
  if (!user)
    return res
      .status(400)
      .json({ success: false, error: "Invalid credentials" });

  // role mismatch check
  if (role && role !== user.role) {
    return res
      .status(400)
      .json({ success: false, error: "Invalid credentials (role mismatch)" });
  }

  const okPass = await bcrypt.compare(password, user.password);
  if (!okPass)
    return res
      .status(400)
      .json({ success: false, error: "Invalid credentials" });

  const token = signToken(user._id, user.role);

  return ok(res, {
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  });
});
