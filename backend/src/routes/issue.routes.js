import { Router } from "express";
import { authMiddleware, isAdmin } from "../middleware/auth.middleware.js";
import { upload } from "../config/cloudinary.js";
import { 
  createIssue, 
  getIssues, 
  getIssuesByCategory, 
  toggleUpvote, 
  deleteIssue 
} from "../controllers/issue.controller.js";

const router = Router();
router.post("/issues", authMiddleware, upload.single("image"), createIssue);
router.get("/issues", getIssues);
router.get("/issues/category/:category", getIssuesByCategory);
router.post("/issues/:id/upvote", authMiddleware, toggleUpvote);
router.delete("/issues/:id", authMiddleware, isAdmin, deleteIssue);
export default router;
