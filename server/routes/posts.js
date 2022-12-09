import express from "express";
import { getFeedPosts, getUserPosts, likePost } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Get all posts
router.get("/", verifyToken, getFeedPosts);

// Get user posts
router.get("/:userId/posts", verifyToken, getUserPosts);

// Like and unlike posts
router.patch("/:id/like", verifyToken, likePost);

export default router;
