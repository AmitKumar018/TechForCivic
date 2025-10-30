import mongoose from "mongoose";

const MAX_ADMINS = 2; // hardcoded safety net

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["citizen", "admin"], default: "citizen" },
  },
  { timestamps: true }
);

//  Pre-save hook to prevent creating more than MAX_ADMINS
userSchema.pre("save", async function (next) {
  if (this.role === "admin" && this.isNew) {
    const adminCount = await mongoose.models.User.countDocuments({ role: "admin" });
    if (adminCount >= MAX_ADMINS) {
      return next(new Error("Admin limit reached — cannot add more admins"));
    }
  }
  next();
});

export default mongoose.model("User", userSchema);
