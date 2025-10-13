import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ok, created } from "../utils/apiResponse.js";
import { ah } from "../utils/asyncHandler.js";

const signToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });

// SIGNUP 
export const signup = ah(async (req, res) => {
  const { name, email, password, role } = req.body;

  const exists = await User.findOne({ email });
  if (exists)
    return res.status(400).json({ success: false, error: "Email already in use" });

  const hash = await bcrypt.hash(password, 10);

  
  const userRole = role === "admin" ? "admin" : "citizen";

  const user = await User.create({
    name,
    email,
    password: hash,
    role: userRole,
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

// LOGIN 
export const login = ah(async (req, res) => {
  const { email, password, role } = req.body;

  const user = await User.findOne({ email, role });
  if (!user)
    return res.status(400).json({ success: false, error: "Invalid credentials (role mismatch)" });

  const okPass = await bcrypt.compare(password, user.password);
  if (!okPass)
    return res.status(400).json({ success: false, error: "Invalid credentials" });

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
