// backend/routes/taskRoutes.js

const express = require("express");
const router = express.Router();
const { verify, verifyAdmin } = require("../auth");
const taskController = require("../controllers/taskController");

// --- USER-ACCESSIBLE ROUTES ---
router.get("/my-tasks", verify, taskController.getMyTasks);
router.post("/add", verify, taskController.addTask);
router.patch("/:taskId/toggle", verify, taskController.toggleTaskStatus);
// NEW: Allow users to update and delete their own tasks
router.put("/:taskId", verify, taskController.updateTask);
router.delete("/:taskId", verify, taskController.deleteTask);

// --- ADMIN-ONLY ROUTES ---
router.get("/", verify, verifyAdmin, taskController.getAllTasks);
router.get("/:taskId", verify, verifyAdmin, taskController.getTaskById);

module.exports = router;
