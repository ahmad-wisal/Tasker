import Task from "../models/Task.js";

/**
 * @desc    Create a new task
 * @route   POST /api/tasks
 * @access  Customer
 */
export const createTask = async (req, res) => {
  try {
    if (req.user.role !== "customer") {
      return res.status(403).json({ message: "Only customers can create tasks" });
    }

    const {
      title,
      description,
      price,
      location,
      urgency,
      scheduledAt,
    } = req.body;

    const task = await Task.create({
      title,
      description,
      price,
      location,
      urgency,
      scheduledAt,
      customer: req.user.id,
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get all open tasks (with filters)
 * @route   GET /api/tasks
 * @access  Tasker
 */
export const getTasks = async (req, res) => {
  try {
    if (req.user.role !== "tasker") {
      return res.status(403).json({ message: "Only taskers can view tasks" });
    }

    const query = { status: "open" };

    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    if (req.query.location) {
      query.location = req.query.location;
    }

    if (req.query.urgency) {
      query.urgency = req.query.urgency;
    }

    const tasks = await Task.find(query).sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Accept a task
 * @route   PUT /api/tasks/:id/accept
 * @access  Tasker
 */
export const acceptTask = async (req, res) => {
  try {
    if (req.user.role !== "tasker") {
      return res.status(403).json({ message: "Only taskers can accept tasks" });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.status !== "open") {
      return res.status(400).json({ message: "Task is not available" });
    }

    task.tasker = req.user.id;
    task.status = "assigned";

    await task.save();

    res.status(200).json({ message: "Task accepted successfully", task });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
