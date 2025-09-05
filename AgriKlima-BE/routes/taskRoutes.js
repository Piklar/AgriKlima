// backend/routes/taskRoutes.js

const express = require("express");
const router = express.Router();
const { verify, verifyAdmin } = require("../auth");
const taskController = require("../controllers/taskController");

// --- USER-ACCESSIBLE ROUTES ---
router.get("/my-tasks", verify, taskController.getMyTasks);
router.post("/add", verify, taskController.addTask); // Users can add tasks for themselves
router.patch("/:taskId/toggle", verify, taskController.toggleTaskStatus); // Users can complete their tasks

// --- ADMIN-ONLY ROUTES ---
// Admins use the same addTask controller but can specify 'assignedTo' in the body
router.get("/", verify, verifyAdmin, taskController.getAllTasks);
router.get("/:taskId", verify, verifyAdmin, taskController.getTaskById);
router.put("/:taskId", verify, verifyAdmin, taskController.updateTask);
router.delete("/:taskId", verify, verifyAdmin, taskController.deleteTask);

module.exports = router;