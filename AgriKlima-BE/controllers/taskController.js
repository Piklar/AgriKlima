// backend/controllers/taskController.js

const Task = require("../models/Task");
const mongoose = require('mongoose');
const { addDays, addWeeks, addMonths } = require('date-fns');

// ADD TASK (Handles frequency for both Admins and Users)
exports.addTask = async (req, res) => {
    try {
        const { title, description, dueDate, frequency, assignedTo } = req.body;
        const createdBy = req.user.id; 

        const baseTask = {
            title,
            description,
            dueDate: new Date(dueDate),
            frequency,
            createdBy,
            // Use assignedTo if provided (by admin), otherwise it defaults to the creator
            assignedTo: assignedTo || createdBy 
        };

        if (frequency === 'Once' || !frequency) {
            const newTask = new Task(baseTask);
            await newTask.save();
        } else {
            const tasksToCreate = [];
            const recurrenceId = new mongoose.Types.ObjectId();
            let currentDate = new Date(dueDate);

            for (let i = 0; i < 90; i++) {
                tasksToCreate.push({ ...baseTask, dueDate: currentDate, recurrenceId });
                if (frequency === 'Daily') currentDate = addDays(currentDate, 1);
                else if (frequency === 'Weekly') currentDate = addWeeks(currentDate, 1);
                else if (frequency === 'Monthly') currentDate = addMonths(currentDate, 1);
                else break;
            }
            await Task.insertMany(tasksToCreate);
        }
        
        res.status(201).json({ message: "Task(s) created successfully" });

    } catch (err) {
        console.error("Error creating task:", err);
        res.status(500).json({ error: "Failed to create task", details: err.message });
    }
};


// GET MY TASKS (For logged-in USERS)
exports.getMyTasks = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const query = { assignedTo: req.user.id };

        if (startDate && endDate) {
            query.dueDate = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }
        const tasks = await Task.find(query).sort({ dueDate: 'asc' });
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch user tasks", details: err.message });
    }
};

// --- NEW FUNCTION for toggling task status ---
exports.toggleTaskStatus = async (req, res) => {
    try {
        const taskId = req.params.taskId;
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }
        if (task.assignedTo.toString() !== req.user.id && !req.user.isAdmin) {
            return res.status(403).json({ error: "Forbidden: You do not have permission to modify this task." });
        }
        
        task.status = task.status === 'pending' ? 'completed' : 'pending';
        await task.save();
        res.status(200).json(task);
    } catch (err) {
        console.error("Error toggling task status:", err);
        res.status(500).json({ error: "Failed to update task status", details: err.message });
    }
};


// --- ADMIN-ONLY FUNCTIONS ---

// GET ALL TASKS (For ADMINS)
exports.getAllTasks = async (req, res) => {
    try {
        // --- THIS IS THE FIX ---
        // We fetch all tasks and populate the assignedTo field.
        // Mongoose is smart enough to not crash if assignedTo is null.
        const tasks = await Task.find({})
            .populate("createdBy", "firstName lastName")
            .populate("assignedTo", "firstName lastName");
        res.status(200).json(tasks);
    } catch (err) {
        console.error("Error fetching all tasks:", err);
        res.status(500).json({ error: "Failed to fetch all tasks", details: err.message });
    }
};

// UPDATE TASK (For ADMINS)
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

// DELETE TASK (For ADMINS)
exports.deleteTask = async (req, res) => {
    try {
        const deletedTask = await Task.findByIdAndDelete(req.params.taskId);
        if (!deletedTask) return res.status(404).json({ error: "Task not found" });
        res.status(200).json({ message: "Task deleted", task: deletedTask });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete task", details: err.message });
    }
};

// GET TASK BY ID (Can be used by both, no changes)
exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.taskId).populate("assignedTo", "firstName lastName email");
        if (!task) return res.status(404).json({ error: "Task not found" });
        res.status(200).json(task);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch task", details: err.message });
    }
};