const express = require("express");
const router = express.Router();
const { verify, verifyAdmin  } = require("../auth");
const taskController = require("../controllers/taskController");

// Create Task (admin or user - depending on your requirement)
router.post("/add", verify, taskController.addTask);

// Get All Tasks
router.get("/", verify, taskController.getAllTasks);

// Get Task by ID
router.get("/:taskId", verify, taskController.getTaskById);

// Update Task
router.put("/:taskId", verify, taskController.updateTask);

// Delete Task
router.delete("/:taskId", verify, taskController.deleteTask);

// Archive Task (Admin Only)
router.put("/:taskId/archive", verify, verifyAdmin, taskController.archiveTask);

module.exports = router;

