import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";

dotenv.config();

const seedAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const existing = await User.findOne({ email: "admin@civic.com" });
  if (existing) {
    console.log("Admin already exists");
    process.exit();
  }

  const hashed = await bcrypt.hash("Admin@123", 10);
  await User.create({
    name: "Super Admin",
    email: "admin@civic.com",
    password: hashed,
    role: "admin",
  });
  
  process.exit();
};

seedAdmin();
