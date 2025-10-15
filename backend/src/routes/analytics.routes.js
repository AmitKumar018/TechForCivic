import express from "express";
import Issue from "../models/Issue.js";

const router = express.Router();



// Get all issues (safe fields only)
router.get("/issues", async (_req, res) => {
  try {
    const issues = await Issue.find().select("category status createdAt updatedAt");
    res.json({ success: true, data: issues });
  } catch (err) {
    console.error("Error fetching issues:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

//  Overall stats (total, pending, solved)
router.get("/stats", async (_req, res) => {
  try {
    const total = await Issue.countDocuments();
    const pending = await Issue.countDocuments({ status: "Pending" });
    const solved = await Issue.countDocuments({ status: "Solved" });

    res.json({
      success: true,
      data: { total, pending, solved },
    });
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Category stats (for Bar & Pie charts)
router.get("/category-stats", async (_req, res) => {
  try {
    const categories = await Issue.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $project: { category: "$_id", count: 1, _id: 0 } },
      { $sort: { count: -1 } },
    ]);

    res.json({ success: true, data: categories });
  } catch (err) {
    console.error("Error fetching category stats:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Monthly solved issues (for Line chart)
router.get("/solved-monthly", async (_req, res) => {
  try {
    const monthly = await Issue.aggregate([
      { $match: { status: "Solved" } },
      {
        $group: {
          _id: { $dateToString: { format: "%b %Y", date: "$updatedAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const formatted = monthly.map((m) => ({
      month: m._id,
      count: m.count,
    }));

    res.json({ success: true, data: formatted });
  } catch (err) {
    console.error("Error fetching solved monthly stats:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
