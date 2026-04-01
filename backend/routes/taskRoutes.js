import express from "express";
import {
  createTask,
  getTasks,
  acceptTask,
  getMyTasks,
  getAssignedTasks,
  startTask,
  completeTaskByCustomer,
  cancelTask,
  taskerDashboard,
  customerDashboard,
} from "../controllers/taskController.js";

import protect from "../middleware/authMiddleware.js";
import { isCustomer, isTasker } from "../middleware/roleMiddleware.js";

const router = express.Router();

/* =========================
   CUSTOMER ROUTES
========================= */

// Customer creates a task
router.post("/", protect, isCustomer, createTask);

// Customer views dashboard
router.get("/dashboard/customer", protect, isCustomer, customerDashboard);
// Customer views their own tasks
router.get("/my", protect, isCustomer, getMyTasks);

// Customer cancels a task (only if open)
router.patch("/:id/cancel", protect, isCustomer, cancelTask);

/* =========================
   TASKER ROUTES
========================= */

// Tasker views all open tasks (with filters)
router.get("/", protect, isTasker, getTasks);

// Tasker views dashboard

router.get("/dashboard/tasker", protect, isTasker, taskerDashboard);

// Tasker views tasks assigned to them
router.get("/assigned", protect, isTasker, getAssignedTasks);

// Tasker accepts a task
router.patch("/:id/accept", protect, isTasker, acceptTask);

// Tasker starts task
router.patch("/:id/start", protect, isTasker, startTask);

// Customer completes task + review
router.patch("/:id/complete",protect,isCustomer,completeTaskByCustomer);

export default router;
