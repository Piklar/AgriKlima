const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: String, enum: ["pending", "completed"], default: "pending" },
    dueDate: { type: Date },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);