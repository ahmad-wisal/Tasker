import express from "express";
import {
  createTask,
  getTasks,
  acceptTask,
} from "../controllers/taskController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Create task (Customer)
router.post("/", protect, createTask);

// Get tasks with filters (Tasker)
router.get("/", protect, getTasks);

// Accept a task (Tasker)
router.put("/:id/accept", protect, acceptTask);

export default router;
