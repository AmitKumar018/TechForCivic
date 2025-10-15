import Issue from "../models/Issue.js";
import { ok } from "../utils/apiResponse.js";
import { ah } from "../utils/asyncHandler.js";

export const adminGetIssues = ah(async (_req, res) => {
  const issues = await Issue.find().populate("createdBy", "name email");
  return ok(res, issues);
});

export const adminUpdateStatus = ah(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const allowed = ["Pending", "In Progress", "Solved"];
  if (!allowed.includes(status)) return res.status(400).json({ success: false, error: "Invalid status" });
  const issue = await Issue.findByIdAndUpdate(id, { status }, { new: true });
  if (!issue) return res.status(404).json({ success: false, error: "Issue not found" });
  return ok(res, issue);
});

export const adminDeleteIssue = ah(async (req, res) => {
  const { id } = req.params;
  const deleted = await Issue.findByIdAndDelete(id);
  if (!deleted) return res.status(404).json({ success: false, error: "Issue not found" });
  return ok(res, { deleted: true });
});

export const adminStats = ah(async (_req, res) => {
  const total = await Issue.countDocuments();
  const pending = await Issue.countDocuments({ status: "Pending" });
  const solved = await Issue.countDocuments({ status: "Solved" });

  const agg = await Issue.aggregate([
    { $unwind: { path: "$upvotes", preserveNullAndEmptyArrays: true } },
    { $group: { _id: "$category", votes: { $sum: { $cond: [{ $ifNull: ["$upvotes", false] }, 1, 0] } } } },
    { $sort: { votes: -1 } },
    { $limit: 1 }
  ]);

  const mostUpvotedCategory = agg.length ? agg[0]._id : null;
  return ok(res, { total, pending, solved, mostUpvotedCategory });
});