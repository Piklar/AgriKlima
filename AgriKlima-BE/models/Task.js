// backend/models/Task.js

const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, enum: ["pending", "completed"], default: "pending" },
  dueDate: { type: Date, required: true },
  frequency: {
    type: String,
    enum: ["Once", "Daily", "Weekly", "Monthly"],
    default: "Once"
  },
  recurrenceId: { type: mongoose.Schema.Types.ObjectId },
  // NEW: Add crop reference
  cropId: { type: mongoose.Schema.Types.ObjectId, ref: "Crop" },
  // NEW: Add color for crop-specific tasks
  color: { type: String, default: "#2e7d32" }
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);
