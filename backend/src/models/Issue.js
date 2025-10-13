import mongoose from "mongoose";

const issueSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: [
        "Potholes",
        "Water Problems",
        "Street Lights",
        "Waste Management",
        "Others",
      ],
      required: true,
    },
    priority: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "Medium",
      required: true,
    },
    imageUrl: { type: String, default: "" },
    location: {
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: {
        type: [Number],
        index: "2dsphere",
        default: [0, 0],
      },
    },
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Solved"],
      default: "Pending",
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming staff are also in User collection
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Issue", issueSchema);
