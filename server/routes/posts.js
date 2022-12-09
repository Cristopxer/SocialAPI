import express from "express";
import { getFeedPosts, getUserPosts, likePosts } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth";

const router = express.Router();

// Get all posts
router.get("/", verifyToken, getFeedPosts);

// Get user posts
router.get("/:userId/posts", verifyToken, getUserPosts);

// Like and unlike posts
router.patch("/:id/like", verifyToken, likePosts);

export default router;
