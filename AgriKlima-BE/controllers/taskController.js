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
        const deletedTask = await Task.findByIdAndDelete(req.params.taskId);
        if (!deletedTask) return res.status(404).json({ error: "Task not found" });
        res.status(200).json({ message: "Task deleted", task: deletedTask });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete task", details: err.message });
    }
};