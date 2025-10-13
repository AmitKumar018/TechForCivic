import Issue from "../models/Issue.js";
import { ok, created } from "../utils/apiResponse.js";
import { ah } from "../utils/asyncHandler.js";

// Create Issue
export const createIssue = ah(async (req, res) => {
  const { title, description, category, priority, lat, lng } = req.body;

  const issue = await Issue.create({
    title,
    description,
    category,
    priority, 
    imageUrl: req.file?.path || "",
    location: {
      type: "Point",
      coordinates: [parseFloat(lng || 0), parseFloat(lat || 0)],
    },
    createdBy: req.user._id,
    status: "Pending",
  });

  return created(res, issue);
});

// Get All Issues 
export const getIssues = ah(async (_req, res) => {
  const issues = await Issue.find().populate("createdBy", "name email");
  return ok(res, issues);
});

// Get Issues by Category
export const getIssuesByCategory = ah(async (req, res) => {
  const { category } = req.params;
  const issues = await Issue.find({ category }).populate("createdBy", "name email");
  return ok(res, issues);
});

// Toggle Upvote 
export const toggleUpvote = ah(async (req, res) => {
  const issue = await Issue.findById(req.params.id);
  if (!issue) return res.status(404).json({ success: false, error: "Issue not found" });

  const userId = req.user._id.toString();
  const has = issue.upvotes.some((u) => u.toString() == userId);
  issue.upvotes = has
    ? issue.upvotes.filter((u) => u.toString() !== userId)
    : [...issue.upvotes, req.user._id];

  await issue.save();
  return ok(res, issue);
});

// Delete Issue
export const deleteIssue = ah(async (req, res) => {
  const issue = await Issue.findById(req.params.id);
  if (!issue) return res.status(404).json({ success: false, error: "Issue not found" });

  await issue.deleteOne();
  return ok(res, { message: "Issue deleted successfully" });
});
