// backend/controllers/taskController.js

const Task = require("../models/Task");
const mongoose = require('mongoose');
const { addDays, addWeeks, addMonths } = require('date-fns');

// ADD TASK (Handles frequency for both Admins and Users)
exports.addTask = async (req, res) => {
  try {
    const { title, description, dueDate, frequency, assignedTo, cropId, color } = req.body;
    const createdBy = req.user.id;

    const baseTask = {
      title,
      description,
      dueDate: new Date(dueDate),
      frequency,
      createdBy,
      assignedTo: assignedTo || createdBy,
      cropId: cropId || null,
      color: color || "#2e7d32"
    };

    if (frequency === 'Once' || !frequency) {
      const newTask = new Task(baseTask);
      await newTask.save();
    } else {
      const tasksToCreate = [];
      const recurrenceId = new mongoose.Types.ObjectId();
      let currentDate = new Date(dueDate);

      for (let i = 0; i < 90; i++) {
        tasksToCreate.push({ ...baseTask, dueDate: new Date(currentDate), recurrenceId });
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

    const tasks = await Task.find(query)
      .populate("cropId", "name")
      .sort({ dueDate: 'asc' });
    
    res.status(200).json(tasks);
  } catch (err) {
    console.error("Error fetching user tasks:", err);
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
    const tasks = await Task.find({})
      .populate("createdBy", "firstName lastName")
      .populate("assignedTo", "firstName lastName")
      .populate("cropId", "name");
    
    res.status(200).json(tasks);
  } catch (err) {
    console.error("Error fetching all tasks:", err);
    res.status(500).json({ error: "Failed to fetch all tasks", details: err.message });
  }
};

// UPDATE TASK (For ADMINS or Users) - FIXED TO HANDLE RECURRING TASKS
exports.updateTask = async (req, res) => {
  try {
    const { title, description, dueDate, frequency, applyToSeries } = req.body;
    const taskId = req.params.taskId;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // If applyToSeries is true and task has recurrenceId, update all future tasks in the series
    if (applyToSeries && task.recurrenceId) {
      const updateData = {};
      if (title) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (frequency) updateData.frequency = frequency;

      // Update all tasks with the same recurrenceId that have a dueDate >= current task's dueDate
      await Task.updateMany(
        {
          recurrenceId: task.recurrenceId,
          dueDate: { $gte: task.dueDate }
        },
        { $set: updateData }
      );

      res.status(200).json({ message: "All future recurring tasks updated successfully" });
    } else {
      // Update only this single task
      const updateData = {};
      if (title) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (dueDate) updateData.dueDate = new Date(dueDate);
      if (frequency) updateData.frequency = frequency;

      const updatedTask = await Task.findByIdAndUpdate(
        taskId,
        { $set: updateData },
        { new: true }
      );

      res.status(200).json(updatedTask);
    }
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ error: "Failed to update task", details: err.message });
  }
};

// DELETE TASK (For ADMINS or Users) - ENHANCED TO HANDLE RECURRING TASKS
exports.deleteTask = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const { deleteAll } = req.query;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // If deleteAll is true and task has recurrenceId, delete all tasks in the series
    if (deleteAll === 'true' && task.recurrenceId) {
      await Task.deleteMany({
        recurrenceId: task.recurrenceId,
        dueDate: { $gte: task.dueDate }
      });
      res.status(200).json({ message: "All future recurring tasks deleted" });
    } else {
      // Delete only this single task
      await Task.findByIdAndDelete(taskId);
      res.status(200).json({ message: "Task deleted", task });
    }
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ error: "Failed to delete task", details: err.message });
  }
};

// GET TASK BY ID (Can be used by both, no changes)
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId)
      .populate("assignedTo", "firstName lastName email")
      .populate("cropId", "name");
    
    if (!task) return res.status(404).json({ error: "Task not found" });
    
    res.status(200).json(task);
  } catch (err) {
    console.error("Error fetching task:", err);
    res.status(500).json({ error: "Failed to fetch task", details: err.message });
  }
};
