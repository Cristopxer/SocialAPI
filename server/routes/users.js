import express from "express";
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

// Get user info
router.get("/:id", verifyToken, getUser);
// Get user friends
router.get("/:id/friends", verifyToken, getUserFriends);
// Update user friends list
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

export default router;
