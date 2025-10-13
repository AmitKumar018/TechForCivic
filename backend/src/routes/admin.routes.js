import express from "express";
import { authMiddleware, isAdmin } from "../middleware/auth.middleware.js";
import Issue from "../models/Issue.js";
import User from "../models/User.js";

const router = express.Router();

// ✅ Admin: get all users
router.get("/users", authMiddleware, isAdmin, async (_req, res) => {
  const users = await User.find().select("-password");
  res.json({ success: true, users });
});

// ✅ Admin: get all issues
router.get("/issues", authMiddleware, isAdmin, async (_req, res) => {
  const issues = await Issue.find()
    .populate("createdBy", "name email")
    .populate("assignedTo", "name email"); // also populate assigned staff
  res.json({ success: true, data: issues });
});

// ✅ Admin: update issue status
router.put("/issues/status/:id", authMiddleware, isAdmin, async (req, res) => {
  const { status } = req.body;

  if (!["Pending", "In Progress", "Solved"].includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid status" });
  }

  const issue = await Issue.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  if (!issue) {
    return res.status(404).json({ success: false, message: "Issue not found" });
  }

  res.json({ success: true, data: issue });
});

// ✅ Admin: assign issue to a staff member
router.put("/issues/assign/:id", authMiddleware, isAdmin, async (req, res) => {
  const { staffId } = req.body;

  // Check staff exists
  const staff = await User.findById(staffId);
  if (!staff) {
    return res.status(404).json({ success: false, message: "Staff not found" });
  }

  const issue = await Issue.findByIdAndUpdate(
    req.params.id,
    { assignedTo: staffId },
    { new: true }
  ).populate("assignedTo", "name email");

  if (!issue) {
    return res.status(404).json({ success: false, message: "Issue not found" });
  }

  res.json({ success: true, data: issue });
});

// ✅ Admin: delete an issue
router.delete("/issues/:id", authMiddleware, isAdmin, async (req, res) => {
  await Issue.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "Issue deleted" });
});

// ✅ Admin: basic statistics
router.get("/stats", authMiddleware, isAdmin, async (_req, res) => {
  const total = await Issue.countDocuments();
  const pending = await Issue.countDocuments({ status: "Pending" });
  const solved = await Issue.countDocuments({ status: "Solved" });

  // Most upvoted category
  const mostUpvoted = await Issue.aggregate([
    { $unwind: "$upvotes" },
    { $group: { _id: "$category", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 1 },
  ]);

  res.json({
    success: true,
    data: {
      total,
      pending,
      solved,
      mostUpvotedCategory: mostUpvoted[0]?._id || "N/A",
    },
  });
});
router.get("/stats/extended", authMiddleware, isAdmin, async (_req, res) => {
  try {
    // 1. Issues per category
    const issuesPerCategory = await Issue.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // 2. Issues per priority
    const issuesPerPriority = await Issue.aggregate([
      { $group: { _id: "$priority", count: { $sum: 1 } } }
    ]);

    // 3. Issues solved per month
    const solvedPerMonth = await Issue.aggregate([
      { $match: { status: "Solved" } },
      {
        $group: {
          _id: { year: { $year: "$updatedAt" }, month: { $month: "$updatedAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // 4. Heatmap data (lat, lng of all issues)
    const heatmapData = await Issue.find({}, "location.coordinates category priority status");

    res.json({
      success: true,
      data: {
        issuesPerCategory,
        issuesPerPriority,
        solvedPerMonth,
        heatmapData
      }
    });
  } catch (err) {
    console.error("Error in extended stats", err);
    res.status(500).json({ success: false, message: "Failed to load stats" });
  }
});

export default router;
