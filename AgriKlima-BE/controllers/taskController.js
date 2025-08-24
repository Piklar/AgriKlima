const Task = require("../models/Task");

// Create Task
exports.addTask = async (req, res) => {
    try {
        const newTask = new Task(req.body);
        await newTask.save();
        res.status(201).json(newTask);
    } catch (err) {
        res.status(500).json({ error: "Failed to create task", details: err.message });
    }
};

// Get all tasks assigned to the currently logged-in user
exports.getMyTasks = async (req, res) => {
    try {
        // req.user.id comes from the `verify` middleware
        const tasks = await Task.find({ assignedTo: req.user.id });
        if (!tasks) {
            return res.status(200).json([]); // Return empty array if no tasks
        }
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch user tasks", details: err.message });
    }
};

// Get All Tasks
exports.getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find().populate("assignedTo", "firstName lastName email");
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch tasks", details: err.message });
    }
};

// Get Task by ID
exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.taskId).populate("assignedTo", "firstName lastName email");
        if (!task) return res.status(404).json({ error: "Task not found" });
        res.status(200).json(task);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch task", details: err.message });
    }
};

// Update Task
exports.updateTask = async (req, res) => {
    try {
        const updatedTask = await Task.findByIdAndUpdate(
            req.params.taskId,
            req.body,
            { new: true }
        );
        if (!updatedTask) return res.status(404).json({ error: "Task not found" });
        res.status(200).json(updatedTask);
    } catch (err) {
        res.status(500).json({ error: "Failed to update task", details: err.message });
    }
};

// Delete Task
exports.deleteTask = async (req, res) => {
    try {
        const archivedTask = await Task.findByIdAndUpdate(
            req.params.taskId,
            { isActive: false },
            { new: true }
        );
        if (!archivedTask) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.status(200).json({ message: "Task archived (soft deleted)", task: archivedTask });
    } catch (err) {
        res.status(500).json({ error: "Error archiving task", details: err });
    }
};

// Archive Task

exports.archiveTask = async (req, res) => {
    try {
        const archivedTask = await Task.findByIdAndUpdate(
            req.params.taskId,
            { isActive: false },
            { new: true }
        );
        if (!archivedTask) {
            return res.status(404).send({ error: "Task not found" });
        }
        res.status(200).send({
            message: "Task archived successfully",
            archiveTask: archivedTask
        });
    } catch (err) {
        res.status(500).send({ error: "Error archiving task", details: err });
    }
};