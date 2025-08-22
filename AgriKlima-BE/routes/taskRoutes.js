//taskRoutes.js
const express = require("express");
const router = express.Router();
const { verify,  } = require("../auth");
const taskController = require("../controllers/taskController");

// Create Task (admin or user - depending on your requirement)
router.post("/add", verify, taskController.addTask);

// --- ADD THIS NEW ROUTE for regular users ---
router.get("/my-tasks", verify, taskController.getMyTasks);

// Get All Tasks
router.get("/", verify, taskController.getAllTasks);

// Get Task by ID
router.get("/:taskId", verify, taskController.getTaskById);

// Update Task
router.put("/:taskId", verify, taskController.updateTask);

// Delete Task
router.delete("/:taskId", verify, taskController.deleteTask);

module.exports = router;